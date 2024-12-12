# backend/src/app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pytesseract
from pdf2image import convert_from_path
import re
import logging 
from datetime import datetime
from shutil import which

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def extract_text_from_pdf(pdf_path):
    try:
        # Check if poppler is installed
        if which('pdftoppm') is None:
            logger.error("Poppler is not installed or not in PATH")
            raise RuntimeError("Poppler is not installed. Please install poppler-utils first.")

        # Convert PDF to images
        logger.debug("Converting PDF to images")
        images = convert_from_path(pdf_path)
        
        # Extract text from each image
        logger.debug(f"Extracting text from {len(images)} pages")
        extracted_text = ""
        for i, image in enumerate(images, 1):
            logger.debug(f"Processing page {i}")
            text = pytesseract.image_to_string(image)
            extracted_text += text + "\n"
            
        return extracted_text
    except Exception as e:
        logger.exception(f"Error extracting text: {str(e)}")
        raise RuntimeError(f"PDF extraction failed: {str(e)}")

def parse_form_data(text, original_filename):
    form_data = {}
    
    # Personal Information - updated patterns
    name_patterns = {
        'firstName': r'1\.\s*Name.*?\n\s*([\w\s]+)\s+(?:John\s+John)',
        'middleName': r'1\.\s*Name.*?\n\s*(?:[\w\s]+)\s+(John)\s+John',
        'lastName': r'1\.\s*Name.*?\n\s*(?:[\w\s]+\s+[\w\s]+)\s+(John)',
    }
    
    # Address Patterns - updated to handle the specific format
    address_patterns = {
        'permanentStreetAddress': r'3\.1\s*Street\s*Address:\s*([^\n]+)',
        'permanentCity': r'3\.2\s*City:\s*([^\n]+?)(?:\s+3\.3|$)',
        'permanentState': r'3\.3\s*State:\s*([^\n]+?)(?:\s+3\.4|$)',
        'permanentZipCode': r'3\.4\s*Zip\s*Code:\s*([^\n]+?)(?:\s+3\.5|$)',
        'permanentCountry': r'3\.5\s*Country:\s*([^\n]+)',
        
        'currentStreetAddress': r'Current\s*Address:.*?Street\s*Address:\s*([^\n]+)',
        'currentCity': r'Current\s*Address:.*?City:\s*([^\n]+?)(?:\s+3\.3|$)',
        'currentState': r'Current\s*Address:.*?State:\s*([^\n]+?)(?:\s+3\.4|$)',
        'currentZipCode': r'Current\s*Address:.*?Zip\s*Code:\s*([^\n]+?)(?:\s+3\.5|$)',
        'currentCountry': r'Current\s*Address:.*?Country:\s*([^\n]+)',
    }
    
    # Personal Details - updated patterns
    personal_patterns = {
        'dateOfBirth': r'Date\s*of\s*Birth:\s*([^\n]+?)(?:\s+5\.|$)',
        'age': r'Age:\s*(\d+)',
        'gender': r'Gender:\s*([^\n]+)',
    }
    
    # Contact Information - updated patterns
    contact_patterns = {
        'passport': r'Passport:\s*([^\n]+?)(?:\s+8\.|$)',
        'mobileNumber': r'Mobile:\s*([^\n]+?)(?:\s+9\.|$)',
        'panNumber': r'PAN\s*No\.:\s*([^\n]+?)(?:\s+10\.|$)',
        'visaNumber': r'Visa:\s*([^\n]+?)(?:\s+11\.|$)',
        'emailId': r'Email\s*ID:\s*([^\n]+?)(?:\s+12\.|$)',
    }
    
    # Emergency Contact - updated patterns
    emergency_patterns = {
        'emergencyContactName': r'Name\s*of\s*Emergency\s*Contact:\s*([^\n]+)',
        'emergencyContactNumber': r'Emergency\s*Contact\'s\s*Number:\s*([^\n]+?)(?:\s+14\.|$)',
    }
    
    # Extract fields using patterns
    all_patterns = {
        **name_patterns,
        **address_patterns,
        **personal_patterns,
        **contact_patterns,
        **emergency_patterns
    }
    
    for field, pattern in all_patterns.items():
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            value = match.group(1).strip()
            if field == 'age' and value.isdigit():
                form_data[field] = int(value)
            else:
                form_data[field] = value
        else:
            if field == 'age':
                form_data[field] = 0
            elif field in ['middleName', 'passport', 'panNumber', 'visaNumber', 'emailId']:
                continue
            else:
                form_data[field] = ""

    # Check for relocation availability - updated pattern
    relocation_match = re.search(r'Available\s*for\s*Relocation:\s*([✓✔\d]+|Yes|No)', text, re.IGNORECASE)
    form_data['availableForRelocation'] = bool(relocation_match and any(
        mark in relocation_match.group(1) for mark in ['✓', '✔', 'Yes', '4']
    ))
    
    # Education section - updated pattern
    education_section = re.search(
        r'EDUCATIONAL\s*QUALIFICATION:.*?(?=15\.\s*Details|$)',
        text,
        re.DOTALL | re.IGNORECASE
    )
    if education_section:
        form_data['educationalQualifications'] = {
            'qualifications': education_section.group(0).strip()
        }
    
    # Training section - updated pattern
    training_section = re.search(
        r'Details\s*of\s*any\s*important\s*training.*?(?=16\.|$)',
        text,
        re.DOTALL | re.IGNORECASE
    )
    if training_section:
        form_data['training'] = {
            'details': training_section.group(0).strip()
        }
    
    # Certification section - updated pattern
    certification_section = re.search(
        r'technical\s*or\s*professional\s*certification.*?(?=17\.|$)',
        text,
        re.DOTALL | re.IGNORECASE
    )
    if certification_section:
        form_data['professionalCertifications'] = {
            'certifications': certification_section.group(0).strip()
        }
    
    # Family section - updated pattern
    family_section = re.search(
        r'Details\s*of\s*Family\s*Members:.*?(?=18\.|$)',
        text,
        re.DOTALL | re.IGNORECASE
    )
    if family_section:
        form_data['familyMembers'] = {
            'members': family_section.group(0).strip()
        }
    
    # References section - updated pattern
    references_section = re.search(
        r'References:.*?(?=Signature|$)',
        text,
        re.DOTALL | re.IGNORECASE
    )
    if references_section:
        form_data['references'] = {
            'referees': references_section.group(0).strip()
        }

    # Add metadata
    form_data['originalFileName'] = original_filename
    form_data['extractedText'] = text
    form_data['extractedAt'] = datetime.utcnow().isoformat()
    
    return form_data

@app.route('/api/upload', methods=['POST'])
def upload_file():
    logger.info('Received file upload request')
    
    if 'file' not in request.files:
        logger.error('No file part in the request')
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        logger.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            # Save PDF file
            filename = secure_filename(file.filename)
            logger.info(f'Processing file: {filename}')
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(temp_path)

            # Extract text from PDF
            logger.debug('Starting text extraction from PDF')
            extracted_text = extract_text_from_pdf(temp_path)
            
            # Clean up the temporary file
            os.remove(temp_path)
            logger.debug('Temporary file removed')

            if extracted_text:
                # Parse the extracted text into structured data
                logger.debug('Parsing extracted text into structured data')
                parsed_data = parse_form_data(extracted_text, filename)
                logger.info('Successfully processed and parsed PDF')
                return jsonify({
                    'text': extracted_text,
                    'parsedData': parsed_data
                }), 200
            else:
                logger.error('Failed to extract text from PDF')
                return jsonify({'error': 'Failed to extract text'}), 500
        except Exception as e:
            logger.exception(f'Error processing upload: {str(e)}')
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

