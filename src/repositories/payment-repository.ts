import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'

class PaymentRepository extends BaseRepository {
  async createPayment(payment: Prisma.PaymentCreateInput) {
    try {
      return await this.prisma.payment.create({ data: payment })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getPaymentById(id: string) {
    try {
      return await this.prisma.payment.findUnique({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getPaymentsByBidId(bidId: string) {
    try {
      return await this.prisma.payment.findMany({ where: { bidId } })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getPayments() {
    try {
      return await this.prisma.payment.findMany()
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const paymentRepository = new PaymentRepository()
