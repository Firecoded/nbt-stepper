import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  businessDetailsSchema,
  INDUSTRIES,
  type BusinessDetailsFormValues,
} from '../../schemas/businessDetailsSchema';
import { useOnboarding } from '../../context/OnboardingContext';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import Input from '../../../shared/components/ui/Input';
import NavButtons from '../layout/NavButtons';

export default function BusinessDetailsStep() {
  const { formData, setStepData, setStepValid } = useOnboarding();
  const { advance } = useStepNavigation('business-details');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<BusinessDetailsFormValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: (formData['business-details'] ?? { companyName: '', industry: '' }) as BusinessDetailsFormValues,
    mode: 'onChange',
  });

  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  const values = watch();
  useEffect(() => {
    if (isValid) {
      setStepData('business-details', values);
    }
  }, [values.companyName, values.industry, isValid]);

  const onSubmit: SubmitHandler<BusinessDetailsFormValues> = (data) => {
    setStepData('business-details', data);
    advance();
  };

  return (
    <div className="rounded-3xl border border-nbt-border bg-nbt-surface p-6 shadow-xl sm:p-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl font-bold text-nbt-text sm:text-4xl">About your business</h2>
        <p className="mt-1 text-base text-nbt-muted sm:mt-2 sm:text-xl">
          Help us tailor the platform to your organisation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
        <Input
          label="Company name"
          placeholder="Acme Corp"
          error={errors.companyName?.message}
          {...register('companyName')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-nbt-text sm:text-base">Industry</label>
          <select
            {...register('industry')}
            className="w-full rounded-xl border border-nbt-border bg-nbt-surface px-4 py-3 text-sm text-nbt-text outline-none transition-colors focus:border-nbt-primary focus:ring-1 focus:ring-nbt-primary sm:text-base"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-xs text-red-400 sm:text-sm">{errors.industry.message}</p>
          )}
        </div>

        <NavButtons onNext={handleSubmit(onSubmit)} />
      </form>
    </div>
  );
}
