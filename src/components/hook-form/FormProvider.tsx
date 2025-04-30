import React from "react";
import {
  FormProvider as RHFFormProvider,
  UseFormReturn,
  SubmitHandler
} from "react-hook-form";

interface FormProviderProps {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit: SubmitHandler<any>;
}

const FormProvider: React.FC<FormProviderProps> = ({
  children,
  methods,
  onSubmit
}) => {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </RHFFormProvider>
  );
};

export default FormProvider;
