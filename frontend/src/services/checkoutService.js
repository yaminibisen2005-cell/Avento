// =========================================================================
// CHECKOUT & RAZORPAY PAYMENT SERVICE - REAL SPRING BOOT BACKEND
// POST /api/payments/create-order
// POST /api/payments/verify
// POST /api/registrations
// =========================================================================

import { paymentApi, registrationApi } from './api';

export const checkoutService = {
  // 1. Create real Registration record (for Free events or direct fallback)
  async createRegistration(event, attendeeData) {
    try {
      const payload = {
        eventId: event.id,
        studentName: attendeeData.fullName,
        studentEmail: attendeeData.email,
        studentPhone: attendeeData.phoneNumber,
        college: attendeeData.college,
        branch: attendeeData.branch,
        year: attendeeData.year,
        gender: attendeeData.gender,
        emergencyContact: attendeeData.emergencyContact,
        teamName: attendeeData.teamName || null,
        specialRequirements: attendeeData.specialRequirements || null,
        paymentMethod: event.fee === 'Free' ? 'Free Tier' : 'Razorpay Standard Checkout'
      };

      const res = await registrationApi.register(payload);

      const registrationRecord = {
        id: res.registrationId || `REG-${res.id}`,
        ticketId: res.ticketId || `AVT-${res.id}`,
        seatNumber: 'GA-A14',
        eventId: res.eventId || event.id,
        eventTitle: res.eventTitle || event.title,
        category: res.category || event.category,
        date: res.date || event.date,
        time: event.time || '09:00 AM IST',
        venue: res.venue || event.venue || 'Main Campus',
        mode: event.mode || 'In-Person',
        image: event.image,
        status: res.status || 'Upcoming',
        registeredOn: res.registeredOn || 'Today',
        paymentStatus: res.paymentStatus,
        fee: event.fee,
        qrCodeData: `AVENTO:TICKET:${event.id}:${attendeeData.fullName.replace(/\s+/g, '_')}:${res.ticketId}`,
        attendee: {
          fullName: attendeeData.fullName,
          email: attendeeData.email,
          phoneNumber: attendeeData.phoneNumber,
          college: attendeeData.college,
          branch: attendeeData.branch,
          year: attendeeData.year,
          gender: attendeeData.gender,
          emergencyContact: attendeeData.emergencyContact,
          teamName: attendeeData.teamName || null,
          specialRequirements: attendeeData.specialRequirements || null
        }
      };

      return {
        success: true,
        message: 'Registration confirmed successfully',
        data: registrationRecord
      };
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Registration failed');
    }
  },

  // 2. Create Real Razorpay Payment Order via Spring Boot
  async createPaymentOrder(event, attendeeData) {
    try {
      const payload = {
        eventId: event.id,
        studentName: attendeeData.fullName,
        studentEmail: attendeeData.email,
        studentPhone: attendeeData.phoneNumber,
        college: attendeeData.college,
        branch: attendeeData.branch,
        year: attendeeData.year,
        gender: attendeeData.gender,
        emergencyContact: attendeeData.emergencyContact,
        teamName: attendeeData.teamName || null,
        specialRequirements: attendeeData.specialRequirements || null
      };

      const orderData = await paymentApi.createOrder(payload);
      return {
        success: true,
        ...orderData
      };
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to create payment order');
    }
  },

  // 3. Verify Real HMAC Razorpay Signature via Spring Boot
  async verifyPayment(verificationPayload) {
    try {
      const ticket = await paymentApi.verifyPayment(verificationPayload);
      return {
        success: true,
        ticket
      };
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Payment signature verification failed');
    }
  }
};
