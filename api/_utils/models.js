import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const RechargeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  energy: { type: Number, required: true },
  remainingEnergy: { type: Number, default: 0 },
  totalEnergy: { type: Number, default: 0 },
  date: { type: Date, required: true },
  averageConsumption: { type: Number, default: 0 },
  estimatedDuration: { type: Number, default: 0 },
  depletionDate: { type: Date },
  actualDuration: { type: Number }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Recharge = mongoose.models.Recharge || mongoose.model('Recharge', RechargeSchema);
