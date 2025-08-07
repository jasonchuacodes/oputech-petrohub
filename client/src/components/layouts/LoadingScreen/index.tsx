import { PageLayout, LoadingSpinner } from '~/components/ui';

export const LoadingScreen = () => {
  return (
    <PageLayout justifyContent="center" alignItems="center">
      <LoadingSpinner />
    </PageLayout>
  );
};
