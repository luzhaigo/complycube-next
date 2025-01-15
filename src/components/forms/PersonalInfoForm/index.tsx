import { FC, useCallback, useMemo, InputHTMLAttributes } from "react";
import cls from "classnames";
import { useForm, Controller, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalInfo as PersonalInfoFormType } from "@/types";
import { personalInfoSchema } from "@/schema/personal-info";
import styles from "./index.module.css";

const Input = ({
  value,
  name,
  label,
  type,
  className,
  error,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
}) => {
  return (
    <span className={cls(styles.row, className)}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        {...rest}
        id={name}
        value={value || ""}
        className={cls(styles.input, error && styles["error"])}
        type={type}
      />
      {error ? (
        <span className={styles["error-message"]}>{error.message}</span>
      ) : null}
    </span>
  );
};

type Props = {
  data?: PersonalInfoFormType;
  onSubmit?: (data: PersonalInfoFormType) => void;
};

const PersonalInfoForm: FC<Props> = ({ data, onSubmit: onSubmitFromProps }) => {
  const { handleSubmit, control, reset } = useForm<PersonalInfoFormType>({
    values: data,
    resolver: zodResolver(personalInfoSchema),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onReset = useCallback(() => reset(), []);

  const onSubmit = useMemo(
    () => handleSubmit((data) => onSubmitFromProps?.(data)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSubmitFromProps]
  );

  return (
    <form className={styles["personal-info-form"]} onSubmit={onSubmit}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="email"
            label="Email"
            error={fieldState?.error}
          />
        )}
      />
      <Controller
        name="firstName"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="text"
            label="First Name"
            error={fieldState?.error}
          />
        )}
      />
      <Controller
        name="lastName"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="text"
            label="Last Name"
            error={fieldState?.error}
          />
        )}
      />
      <Controller
        name="dob"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="date"
            label="Date of Birth"
            error={fieldState?.error}
          />
        )}
      />
      <div className={styles["action-panel"]}>
        <button type="button" className={styles.reset} onClick={onReset}>
          Reset
        </button>
        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
