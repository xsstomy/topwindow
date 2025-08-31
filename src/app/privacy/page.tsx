export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-gray-50 pt-16'>
      <main className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-8'>
            Privacy Policy
          </h1>

          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Last updated: August 22, 2024</p>

            <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
              1. Information Collection
            </h2>
            <p className='text-gray-700 mb-4'>
              We collect information you provide to us, such as your email
              address and name when registering.
            </p>

            <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
              2. Information Usage
            </h2>
            <p className='text-gray-700 mb-4'>
              We use the collected information to provide, maintain, and improve
              our services.
            </p>

            <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
              3. Information Protection
            </h2>
            <p className='text-gray-700 mb-4'>
              We implement appropriate security measures to protect your
              personal information.
            </p>

            <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
              4. Contact Us
            </h2>
            <p className='text-gray-700 mb-4'>
              If you have any questions about our privacy policy, please contact
              us through our support page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
