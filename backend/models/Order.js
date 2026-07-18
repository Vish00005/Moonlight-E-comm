import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }
  ],
  totalPrice: { type: Number, required: true, default: 0.0 },
  paymentMethod: { type: String, required: true, default: 'Razorpay' },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  deliveryStatus: { 
    type: String, 
    required: true, 
    enum: ['Ordered', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Ordered' 
  },
  deliveredAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
