import 'dotenv/config'
import mongoose from 'mongoose'
import { connectToDatabase } from '../config/database.js'
import Place from '../models/Place.js'
import Service from '../models/Service.js'
import Staff from '../models/Staff.js'

const places = [
  ['hospital', '🏥', 'Hospital', 'अस्पताल', 'Manage hospital queues and services.', 'अस्पताल की कतारों और सेवाओं को प्रबंधित करें।'],
  ['bank', '🏦', 'Bank', 'बैंक', 'Track branch service lines and wait time.', 'शाखा सेवा लाइन और इंतज़ार समय को ट्रैक करें।'],
  ['school', '🎓', 'School/College', 'स्कूल/कॉलेज', 'Coordinate student and admin service queues.', 'विद्यार्थियों और प्रशासनिक सेवा कतारों का प्रबंधन करें।'],
  ['government', '🏛️', 'Government Office', 'सरकारी कार्यालय', 'Simplify public service access and queue flow.', 'सार्वजनिक सेवा तक पहुँच और कतार प्रवाह को सरल बनाएं।'],
  ['restaurant', '🍽️', 'Restaurant', 'रेस्टोरेंट', 'Reduce waiting for dine-in and order requests.', 'डाइन-इन और ऑर्डर अनुरोधों के लिए इंतज़ार कम करें।'],
].map(([slug, icon, enName, hiName, enDescription, hiDescription]) => ({
  slug,
  icon,
  name: { en: enName, hi: hiName },
  description: { en: enDescription, hi: hiDescription },
  type: slug,
  active: true,
}))

const serviceDefinitions = [
  ['hospital', 'doctor-consultation', '🩺', 'Doctor Consultation', 'डॉक्टर से परामर्श', 'Meet a doctor for consultation.', 'डॉक्टर से परामर्श के लिए कतार में शामिल हों।'],
  ['hospital', 'diagnostic-tests', '🧪', 'Diagnostic Tests', 'जांच / डायग्नोस्टिक टेस्ट', 'Book a test and check your queue status.', 'परीक्षण बुक करें और अपनी कतार की स्थिति देखें।'],
  ['hospital', 'pharmacy', '💊', 'Pharmacy', 'फार्मेसी', 'Collect medicines and prescription support.', 'दवाइयाँ और प्रिस्क्रिप्शन सहायता प्राप्त करें।'],
  ['hospital', 'registration', '📝', 'Registration', 'पंजीकरण', 'Register for appointments and intake forms.', 'अपॉइंटमेंट और इन्टेक फॉर्म के लिए पंजीकरण करें।'],
  ['hospital', 'billing', '💳', 'Billing', 'बिलिंग', 'Complete payment and billing steps.', 'भुगतान और बिलिंग चरण पूरे करें।'],
  ['bank', 'cash-deposit', '💵', 'Cash Deposit', 'नकद जमा', 'Deposit cash for savings or account services.', 'बचत या खाता सेवाओं के लिए नकद जमा करें।'],
  ['bank', 'cash-withdrawal', '🏧', 'Cash Withdrawal', 'नकद निकासी', 'Withdraw cash from your account quickly.', 'अपने खाते से नकद जल्दी निकासी करें।'],
  ['bank', 'account-services', '📒', 'Account Services', 'खाता सेवाएँ', 'Update accounts and banking details.', 'खाते और बैंकिंग विवरण अपडेट करें।'],
  ['bank', 'loan-services', '🏦', 'Loan Services', 'ऋण सेवाएँ', 'Discuss loan applications and status.', 'ऋण आवेदन और स्थिति पर चर्चा करें।'],
  ['bank', 'customer-support', '🤝', 'Customer Support', 'ग्राहक सहायता', 'Get help with banking queries and issues.', 'बैंकिंग प्रश्नों और समस्याओं के लिए सहायता प्राप्त करें।'],
  ['school', 'admissions', '🎓', 'Admissions', 'प्रवेश', 'Manage enrollment and admission requests.', 'नामांकन और प्रवेश अनुरोध प्रबंधित करें।'],
  ['school', 'student-services', '📚', 'Student Services', 'छात्र सेवाएँ', 'Resolve student records and support requests.', 'छात्र रिकॉर्ड और सहायता अनुरोध हल करें।'],
  ['school', 'fee-counter', '💰', 'Fee Counter', 'शुल्क काउंटर', 'Pay fees and complete fee-related tasks.', 'शुल्क का भुगतान करें और शुल्क से संबंधित कार्य पूरे करें।'],
  ['school', 'certificates', '📜', 'Certificates', 'प्रमाण पत्र', 'Request certificates and academic documents.', 'प्रमाण पत्र और शैक्षणिक दस्तावेज़ अनुरोध करें।'],
  ['school', 'administration', '🏫', 'Administration', 'प्रशासन', 'Contact the administration team for help.', 'सहायता के लिए प्रशासन टीम से संपर्क करें।'],
  ['government', 'document-services', '📄', 'Document Services', 'दस्तावेज़ सेवाएँ', 'Submit and process official documents.', 'आधिकारिक दस्तावेज़ जमा करें और प्रक्रिया करें।'],
  ['government', 'certificates-gov', '🪪', 'Certificates', 'प्रमाण पत्र', 'Request identity and official certificates.', 'पहचान और आधिकारिक प्रमाण पत्र का अनुरोध करें।'],
  ['government', 'applications', '📑', 'Applications', 'आवेदन', 'Submit applications and status requests.', 'आवेदन और स्थिति अनुरोध जमा करें।'],
  ['government', 'public-grievance', '🗣️', 'Public Grievance', 'जन शिकायत', 'Raise complaints and service issues.', 'शिकायतें और सेवा समस्याएँ दर्ज करें।'],
  ['government', 'general-enquiry', '❓', 'General Enquiry', 'सामान्य पूछताछ', 'Ask general questions about services.', 'सेवाओं के बारे में सामान्य प्रश्न पूछें।'],
  ['restaurant', 'table-reservation', '🪑', 'Table Reservation', 'टेबल आरक्षण', 'Reserve a table for your visit.', 'अपनी यात्रा के लिए टेबल आरक्षित करें।'],
  ['restaurant', 'order-counter', '🧾', 'Order Counter', 'ऑर्डर काउंटर', 'Place your order and get assistance.', 'ऑर्डर करें और सहायता प्राप्त करें।'],
  ['restaurant', 'takeaway', '🥡', 'Takeaway', 'टेकअवे', 'Collect food prepared for takeaway.', 'टेकअवे के लिए तैयार भोजन प्राप्त करें।'],
  ['restaurant', 'billing-restaurant', '💳', 'Billing', 'बिलिंग', 'Complete payment at the billing desk.', 'बिलिंग डेस्क पर भुगतान पूरा करें।'],
  ['restaurant', 'customer-support-restaurant', '🤝', 'Customer Support', 'ग्राहक सहायता', 'Get help with food, service, or orders.', 'भोजन, सेवा या ऑर्डर के लिए सहायता प्राप्त करें।'],
].map(([placeSlug, slug, icon, enName, hiName, enDescription, hiDescription]) => ({
  placeSlug,
  slug,
  icon,
  name: { en: enName, hi: hiName },
  description: { en: enDescription, hi: hiDescription },
  prefix: 'A',
  averageServiceTimeMinutes: 3,
  active: true,
  paused: false,
}))

const staffDefinitions = [
  ['hospital', ['doctor-consultation'], 'ananya-sharma', '👩‍⚕️', 'Dr. Ananya Sharma', 'डॉ. अनन्या शर्मा', 'Senior Physician', 'वरिष्ठ चिकित्सक', 'available'],
  ['hospital', ['doctor-consultation'], 'rahul-verma', '👨‍⚕️', 'Dr. Rahul Verma', 'डॉ. राहुल वर्मा', 'Cardiologist', 'हृदय रोग विशेषज्ञ', 'busy'],
  ['hospital', ['doctor-consultation'], 'priya-mehta', '👩‍⚕️', 'Dr. Priya Mehta', 'डॉ. प्रिया मेहता', 'General Physician', 'सामान्य चिकित्सक', 'unavailable', '3:00 PM'],
  ['hospital', ['pharmacy'], 'neha-pharmacist', '👩‍🔬', 'Pharmacist Neha', 'फार्मासिस्ट नेहा', 'Pharmacy Specialist', 'फार्मेसी विशेषज्ञ', 'available'],
  ['hospital', ['pharmacy'], 'amit-pharmacist', '👨‍🔬', 'Pharmacist Amit', 'फार्मासिस्ट अमित', 'Pharmacy Specialist', 'फार्मेसी विशेषज्ञ', 'busy'],
  ['bank', ['customer-support'], 'rohan-officer', '👨‍💼', 'Customer Officer Rohan', 'ग्राहक अधिकारी रोहन', 'Customer Service Officer', 'ग्राहक सेवा अधिकारी', 'available'],
  ['bank', ['customer-support'], 'priya-officer', '👩‍💼', 'Customer Officer Priya', 'ग्राहक अधिकारी प्रिया', 'Customer Service Officer', 'ग्राहक सेवा अधिकारी', 'busy'],
  ['school', ['administration'], 'meena-admin', '👩‍💼', 'Admin Officer Meena', 'प्रशासन अधिकारी मीना', 'Administration Officer', 'प्रशासन अधिकारी', 'available'],
  ['school', ['administration'], 'arjun-admin', '👨‍💼', 'Admin Officer Arjun', 'प्रशासन अधिकारी अर्जुन', 'Administration Officer', 'प्रशासन अधिकारी', 'unavailable', '3:00 PM'],
  ['government', ['general-enquiry'], 'rajesh-officer', '👨‍💼', 'Officer Rajesh', 'अधिकारी राजेश', 'Public Service Officer', 'लोक सेवा अधिकारी', 'available'],
  ['government', ['general-enquiry'], 'sunita-officer', '👩‍💼', 'Officer Sunita', 'अधिकारी सुनीता', 'Public Service Officer', 'लोक सेवा अधिकारी', 'busy'],
  ['restaurant', ['customer-support-restaurant'], 'amit-manager', '👨‍🍳', 'Manager Amit', 'मैनेजर अमित', 'Restaurant Manager', 'रेस्टोरेंट मैनेजर', 'available'],
  ['restaurant', ['customer-support-restaurant'], 'neha-manager', '👩‍🍳', 'Manager Neha', 'मैनेजर नेहा', 'Restaurant Manager', 'रेस्टोरेंट मैनेजर', 'busy'],
].map(([placeSlug, serviceSlugs, slug, icon, enName, hiName, enRole, hiRole, status, expectedAvailableAt = null]) => ({
  placeSlug,
  serviceSlugs,
  slug,
  icon,
  name: { en: enName, hi: hiName },
  role: { en: enRole, hi: hiRole },
  status,
  expectedAvailableAt,
  active: true,
}))

async function seedCatalog() {
  await connectToDatabase()
  const placeIds = new Map()
  const serviceIds = new Map()

  for (const place of places) {
    const savedPlace = await Place.findOneAndUpdate({ slug: place.slug }, { $set: place }, { upsert: true, new: true, setDefaultsOnInsert: true })
    placeIds.set(place.slug, savedPlace._id)
  }

  for (const service of serviceDefinitions) {
    const savedService = await Service.findOneAndUpdate(
      { slug: service.slug },
      { $set: { ...service, placeId: placeIds.get(service.placeSlug) } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    serviceIds.set(service.slug, savedService._id)
  }

  for (const staff of staffDefinitions) {
    await Staff.findOneAndUpdate(
      { slug: staff.slug },
      {
        $set: {
          ...staff,
          placeId: placeIds.get(staff.placeSlug),
          serviceIds: staff.serviceSlugs.map((slug) => serviceIds.get(slug)),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
  }

  console.log(`Seeded ${places.length} places, ${serviceDefinitions.length} services, and ${staffDefinitions.length} staff records`)
}

seedCatalog()
  .catch((error) => {
    console.error(`Catalog seed failed: ${error.message}`)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
