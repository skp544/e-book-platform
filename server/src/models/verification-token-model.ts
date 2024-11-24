import { Model, model, Schema } from "mongoose";
import { hashSync, compareSync, genSaltSync } from "bcrypt";

interface VerificationTokenDocument {
  userId: string;
  token: string;
  expiresAt: Date;
}

interface Methods {
  compare: (token: string) => boolean;
}

const verificationTokenSchema = new Schema<
  VerificationTokenDocument,
  {},
  Methods
>({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 60 * 24,
  },
});

verificationTokenSchema.pre("save", function (next) {
  if (this.isModified("token")) {
    const salt = genSaltSync(10);
    this.token = hashSync(this.token, salt);
  }

  next();
});

verificationTokenSchema.methods.compare = function (token: string) {
  return compareSync(token, this.token);
};

const VerificationToken = model("VerificationToken", verificationTokenSchema);

export default VerificationToken as Model<
  VerificationTokenDocument,
  {},
  Methods
>;
