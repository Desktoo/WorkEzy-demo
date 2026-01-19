import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOB_TYPE,
  LOCATION_TYPE,
  SALARY_RANGE,
} from "@/lib/constants/selectOptions";
import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

export default function JobTypeAndScheduleSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<PostJobFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    control,
    formState: { errors },
  } = form;

  const [startTime, setStartTime] = useState({
    hour: "",
    minute: "",
    meridiem: "",
  });

  const [endTime, setEndTime] = useState({
    hour: "",
    minute: "",
    meridiem: "",
  });

  const formatTime = ({ hour, minute, meridiem }: typeof startTime) => {
    return hour && minute && meridiem ? `${hour}:${minute} ${meridiem}` : "";
  };

  useEffect(() => {
    const startValue = formatTime(startTime);
    const endValue = formatTime(endTime);

    if (startValue) {
      form.setValue("startTime", startValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (endValue) {
      form.setValue("endTime", endValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [startTime, endTime]);

  return (
    <section className="mb-10 flex flex-col gap-4">
      <h3 className="text-lg font-bold mb-2 border-b-2 pb-4 border-gray-200">
        Job Type and Schedule
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Type */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Job Type <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="jobType"
            render={({ field: { value, onChange, onBlur } }) => (
              <Select
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  onBlur();
                  onSectionBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPE.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.jobType && (
            <p className="text-xs text-red-500">{errors.jobType.message}</p>
          )}
        </div>

        {/* Location Type */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Location Type <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="locationType"
            render={({ field: { value, onChange, onBlur } }) => (
              <Select
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  onBlur();
                  onSectionBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location Type" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPE.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationType && (
            <p className="text-xs text-red-500">
              {errors.locationType.message}
            </p>
          )}
        </div>

        {/* Salary Range From*/}
        <div className="space-y-2 flex flex-col md:col-span-2">
          <label className="text-sm font-medium">
            Salary Range (per month in ₹){" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {/* Salary Range From */}
            <Controller
              control={control}
              name="minSalary"
              render={({ field: { value, onChange, onBlur } }) => (
                <Select
                  value={value}
                  onValueChange={(val) => {
                    onChange(val);
                    onBlur();
                    onSectionBlur();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_RANGE.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.minSalary && (
              <p className="text-xs text-red-500">
                {errors.minSalary.message}
              </p>
            )}

            {/* Salary Range To*/}
            <Controller
              control={control}
              name="maxSalary"
              render={({ field: { value, onChange, onBlur } }) => (
                <Select
                  value={value}
                  onValueChange={(val) => {
                    onChange(val);
                    onBlur();
                    onSectionBlur();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_RANGE.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.maxSalary && (
              <p className="text-xs text-red-500">{errors.maxSalary.message}</p>
            )}
          </div>
        </div>

        {/* Time*/}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Office Timings <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {/* Time From */}
            {/* Hour */}
            <Select
              onValueChange={(val) => {
                setStartTime((prev) => ({ ...prev, hour: val }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="09" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {" : "}
            {/* Minutes */}
            <Select
              onValueChange={(val) => {
                setStartTime((prev) => ({ ...prev, minute: val }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="00" />
              </SelectTrigger>
              <SelectContent>
                {["15", "30", "45", "00"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Meridiem */}
            <Select
              onValueChange={(val) => {
                setStartTime((prev) => ({ ...prev, meridiem: val }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="AM" />
              </SelectTrigger>
              <SelectContent>
                {["AM", "PM"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-6">
            {/* Time From */}
            {/* Hour */}
            <Select
              onValueChange={(val) => {
                setEndTime((prev) => ({ ...prev, hour: val }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="05" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {" : "}
            {/* Minutes */}
            <Select
              onValueChange={(val) => {
                setEndTime((prev) => ({ ...prev, minute: val }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="00" />
              </SelectTrigger>
              <SelectContent>
                {["15", "30", "45", "00"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Meridiem */}
            <Select
              onValueChange={(val) => {
                setEndTime((prev) => ({ ...prev, meridiem: val }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="PM" />
              </SelectTrigger>
              <SelectContent>
                {["AM", "PM"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Working Days */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Days per Week <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="daysPerWeek"
            render={({ field: { value, onChange, onBlur } }) => (
              <Select
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  onBlur();
                  onSectionBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Working days" />
                </SelectTrigger>
                <SelectContent>
                  {["4 days", "5 days", "6 days"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.daysPerWeek && (
            <p className="text-xs text-red-500">{errors.daysPerWeek.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
