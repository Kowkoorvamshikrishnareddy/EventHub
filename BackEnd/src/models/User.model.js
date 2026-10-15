import mongoose, { Schema, SchemaTypes } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "organizer", "attendee"],
      required: true,
    },
    organization: {
      type: String,
      required: function () {
        this.role === "admin";
      },
    },
    assignedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    favorate_events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    registered_attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    
    status: {
      type: String,
      enum: ["Active", "inActive", "Expiry Soon", "Expired"],
      default: "Active",
      required: function () {
        this.role === "admin";
        this.role === "organizer";
        this.role === "attendee";
      },
    },

    membershipType: {
      type: String,
      enum: ["inner", "outer"],
      required: function () {
        this.role === "attendee" || this.role === "organizer";
      },
    },

    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    image:{
      type:String,
    },
    enquiryId:{
      type:Schema.Types.ObjectId,
      ref:"Enquiry"
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
