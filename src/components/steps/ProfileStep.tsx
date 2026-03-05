import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { profileSchema, type ProfileFormValues } from '../../schemas/profileSchema';
import { useWizard } from '../../context/WizardContext';
import Input from '../ui/Input';
import NavButtons from '../layout/NavButtons';

export default function ProfileStep() {
  const { formData, setStepData, setStepValid, setCurrentStep, markStepComplete } = useWizard();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: formData.profile ?? { firstName: '', lastName: '', email: '' },
    mode: 'onChange',
  });

  // Report validity up to context on every change
  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  // Save draft on every field change
  const values = watch();
  useEffect(() => {
    if (isValid) {
      setStepData('profile', values);
    }
  }, [values.firstName, values.lastName, values.email, isValid]);

  const onSubmit = (data: ProfileFormValues) => {
    setStepData('profile', data);
    markStepComplete(1);
    setCurrentStep(2);
    navigate('/preferences');
  };

  return (
    <div className="rounded-3xl border border-nbt-border bg-nbt-surface p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-nbt-text sm:text-2xl">Tell us about yourself</h2>
        <p className="mt-1 text-base text-nbt-muted sm:text-sm">
          This is how your team will know you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
