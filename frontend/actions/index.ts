'use server'

import { db } from "@/lib/prisma"
import { revalidatePath } from 'next/cache'

export async function saveExtractedData(data: any) {
  try {
    const profile = await db.candidateProfile.create({
      data: {
        firstName: data.firstName || '',
        middleName: data.middleName || '',
        lastName: data.lastName || '',
        permanentStreetAddress: data.permanentStreetAddress || '',
        permanentCity: data.permanentCity || '',
        permanentState: data.permanentState || '',
        permanentZipCode: data.permanentZipCode || '',
        permanentCountry: data.permanentCountry || '',
        currentStreetAddress: data.currentStreetAddress || '',
        currentCity: data.currentCity || '',
        currentState: data.currentState || '',
        currentZipCode: data.currentZipCode || '',
        currentCountry: data.currentCountry || '',
        dateOfBirth: data.dateOfBirth || '',
        age: data.age || 0,
        gender: data.gender || '',
        passport: data.passport || '',
        mobileNumber: data.mobileNumber || '',
        panNumber: data.panNumber || '',
        visaNumber: data.visaNumber || '',
        emailId: data.emailId || '',
        emergencyContactName: data.emergencyContactName || '',
        emergencyContactNumber: data.emergencyContactNumber || '',
        availableForRelocation: data.availableForRelocation || false,
        educationalQualifications: data.educationalQualifications || {},
        training: data.training || {},
        professionalCertifications: data.professionalCertifications || {},
        familyMembers: data.familyMembers || {},
        references: data.references || {},
        originalFileName: data.originalFileName || '',
        extractedText: data.extractedText || '',
        extractedAt: new Date(data.extractedAt),
      },
    })

    revalidatePath('/upload')
    return { success: true, data: profile }
  } catch (error) {
    console.error('Error saving data:', error)
    return { success: false, error: 'Failed to save data' }
  }
}
