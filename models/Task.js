import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  message: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  dueDate: { type: Date }
}, { versionKey: false, 
     toJSON: {
        transform(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        },
     }
  });

const taskModel = model("Task", taskSchema);

export default taskModel;
