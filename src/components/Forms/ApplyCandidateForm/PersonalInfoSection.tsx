// components/candidate/sections/PersonalInfoSection.tsx
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon, Camera } from "lucide-react";
import {
  BOARDS,
  GENDERS,
  GRADUATE_DEGREES,
  MIN_EDUCATION_REQUIRED,
  POST_GRADUATE_DEGREES,
} from "@/lib/constants/selectOptions";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PersonalInfoSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<CandidateApplyFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    control,
  } = form;

  const photoValue = watch("photo")

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if(photoValue instanceof File){
      const objectUrl = URL.createObjectURL(photoValue);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl)
    } else if ( typeof photoValue === "string" && photoValue !== "" ){
      setPreview(photoValue)
    }
  },[photoValue])

  // Handle Photo Upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the file in RHF for Zod validation
      setValue("photo", file, { shouldValidate: true });
    }
  };

  const calculateAge = (dob: Date): number => {
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  const age = form.getValues("age");
  const education = form.getValues("highestEducation");

  return (
    <section className="space-y-8">
      {/* Photo Upload and Preview */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="photo-upload"
            className="h-28 w-28 rounded-full border-2 border-dashed border-muted-foreground/30
                       flex items-center justify-center relative overflow-hidden
                       text-muted-foreground cursor-pointer hover:bg-muted/50 transition-all"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <Camera className="h-8 w-8" />
            )}
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <p className="text-xs font-medium text-muted-foreground">Add Photo</p>
          {errors.photo && (
            <p className="text-xs text-red-500">
              {errors.photo.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-base font-bold text-muted-foreground mb-6">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter your full name"
              {...register("fullName")}
              onBlur={onSectionBlur}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Email 
            </label>
            <Input
              placeholder="Enter your email"
              {...register("email")}
              onBlur={onSectionBlur}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input type="tel" {...register("phoneNumber")} readOnly />
            {form.formState.errors.phoneNumber && (
              <p className="text-xs text-red-500">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Gender <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value, onBlur } }) => (
                <Select
                  value={value}
                  onValueChange={(val) => {
                    onChange(val);
                    onBlur();
                    onSectionBlur();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field: { onChange, value, onBlur } }) => {
                    // Convert string → Date for calendar
                    const selectedDate = value ? new Date(value) : undefined;

                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between font-normal text-left"
                          >
                            {value
                              ? new Date(value).toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              if (!date) return;

                              const calculatedAge = calculateAge(date);

                              // Store as string (IMPORTANT)
                              onChange(date.toISOString());

                              setValue("age", calculatedAge, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              onBlur();
                              onSectionBlur();
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              {age !== undefined && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Age</label>
                  <span className="font-medium text-sm">{`${age} years old`}</span>
                  {errors.age && (
                    <p className="text-xs text-red-500">{errors.age.message}</p>
                  )}
                </div>
              )}
            </div>
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Highest Education */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Highest Education <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-5 w-full">
                  <Controller
                    control={control}
                    name="highestEducation"
                    render={({ field: { onChange, value, onBlur } }) => {
                      return (
                        <Select
                          value={value}
                          onValueChange={(val) => {
                            onChange(val);
                            onBlur();
                            onSectionBlur();
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select education" />
                          </SelectTrigger>
                          <SelectContent>
                            {MIN_EDUCATION_REQUIRED.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              </div>
              {(education === "12th Pass" || education === "10th Pass") && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Board <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="educationSpecialization"
                    render={({ field: { onChange, value, onBlur } }) => {
                      return (
                        <Select
                          value={value}
                          onValueChange={(val) => {
                            onChange(val);
                            onBlur();
                            onSectionBlur();
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select education" />
                          </SelectTrigger>
                          <SelectContent>
                            {BOARDS.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              )}
              {education === "Graduate" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="educationSpecialization"
                    render={({ field: { onChange, value, onBlur } }) => {
                      return (
                        <Select
                          value={value}
                          onValueChange={(val) => {
                            onChange(val);
                            onBlur();
                            onSectionBlur();
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select education" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADUATE_DEGREES.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              )}
              {education === "Post Graduate" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="educationSpecialization"
                    render={({ field: { onChange, value, onBlur } }) => {
                      return (
                        <Select
                          value={value}
                          onValueChange={(val) => {
                            onChange(val);
                            onBlur();
                            onSectionBlur();
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select education" />
                          </SelectTrigger>
                          <SelectContent>
                            {POST_GRADUATE_DEGREES.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              )}
            </div>
            {errors.highestEducation && (
              <p className="text-xs text-red-500">
                {errors.highestEducation.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
