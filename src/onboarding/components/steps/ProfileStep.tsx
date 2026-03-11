import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '../../schemas/profileSchema';
import { useOnboarding } from '../../context/OnboardingContext';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import { FORM_STEP_IDS } from '../../config/steps';
import Input from '../../../shared/components/ui/Input';
import NavButtons from '../layout/NavButtons';

export default function ProfileStep() {
  const { formData, setStepData, setStepValid } = useOnboarding();
  const { advance } = useStepNavigation(FORM_STEP_IDS.profile);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: formData[FORM_STEP_IDS.profile] ?? { firstName: '', lastName: '', email: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  const values = watch();
  useEffect(() => {
    if (isValid) {
      setStepData(FORM_STEP_IDS.profile, values);
    }
  }, [values.firstName, values.lastName, values.email, isValid]);

  const onSubmit = (data: ProfileFormValues) => {
    setStepData(FORM_STEP_IDS.profile, data);
    advance();
  };

  return (
    <div className="rounded-3xl border border-nbt-border bg-nbt-surface p-6 shadow-xl sm:p-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl font-bold text-nbt-text sm:text-4xl">Tell us about yourself</h2>
        <p className="mt-1 text-base text-nbt-muted sm:mt-2 sm:text-xl">
          This is how your team will know you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="alex@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <NavButtons onNext={handleSubmit(onSubmit)} />
      </form>
    </div>
  );
}
