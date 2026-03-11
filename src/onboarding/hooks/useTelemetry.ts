type TelemetryEvent =
  | { name: 'qualifier_selected'; properties: { accountType: 'personal' | 'business' } }
  | { name: 'step_viewed';        properties: { stepId: string } }
  | { name: 'step_completed';     properties: { stepId: string; durationMs: number } }
  | { name: 'onboarding_submitted'; properties: { stepCount: number } };

export function useTelemetry() {
  const track = (event: TelemetryEvent) => {
    const { name, ...rest } = event;
    const properties = 'properties' in rest ? rest.properties : {};
    console.log('[telemetry]', name, properties);

    // PostHog swap (uncomment when ready):
    // posthog.capture(name, properties)
  };

  return { track };
}
