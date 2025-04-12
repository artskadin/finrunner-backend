import { paymentRepository } from '../repositories/payment-repository'
import { BaseService } from './base-service'
import { CreatePaymentInput } from '../schemas/payment-schema'

/**
 * Сервис для работы с платежами
 */
class PaymentService extends BaseService {
  async createPayment(payment: CreatePaymentInput) {
    try {
      const { type, target, amount, deadline, bidId, currencyId } = payment

      const createdPayment = await paymentRepository.createPayment({
        type,
        target,
        status: 'PENDING',
        amount,
        deadline,
        bid: { connect: { id: bidId } },
        currency: { connect: { id: currencyId } }
      })

      return createdPayment
    } catch (err) {
      this.handleError(err)
    }
  }

  async getPaymentById(id: string) {
    try {
    } catch (err) {
      this.handleError(err)
    }
  }

  async getPaymentsByBidId(bidId: string) {
    try {
    } catch (err) {
      this.handleError(err)
    }
  }

  async getPayments() {
    try {
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const paymentService = new PaymentService()
