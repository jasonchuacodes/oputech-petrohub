import { PageLayout, LoadingSpinner } from '~/components/ui';

export const LoadingScreen = () => {
  return (
    <PageLayout justifyContent="center" alignItems="center" height='100vh'>
      <LoadingSpinner />
    </PageLayout>
  );
};
