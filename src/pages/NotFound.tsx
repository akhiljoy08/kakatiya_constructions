import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export const NotFound = () => (
  <main id="main">
    <PageHeader
      eyebrow="404"
      title={<>Page not <em className="text-gold-deep">found</em></>}
      subtitle="The page you're looking for doesn't exist or is not available yet."
    >
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link to="/" className="btn btn-gold">Back to home</Link>
        <Link to="/contact" className="btn btn-outline-dark">Contact us</Link>
      </div>
    </PageHeader>
  </main>
);
