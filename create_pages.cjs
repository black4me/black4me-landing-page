const fs = require('fs');
const path = require('path');

const createPage = (routePath, componentName, importPath) => {
  const dir = path.join('src/app/admin', routePath);
  fs.mkdirSync(dir, { recursive: true });
  const content = `import React from 'react';
import { ${componentName} } from '${importPath}';

export default function Page() {
  return (
    <div className="p-6">
      <${componentName} />
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
  console.log('Created ' + routePath);
};

createPage('campaigns', 'EmailCampaignsTab', '@/views/admin/EmailCampaignsTab');
createPage('subscribers', 'NewsletterTab', '@/views/admin/NewsletterTab');
createPage('comparison', 'ComparisonTab', '@/views/admin/CmsTabs');
createPage('funnels', 'FunnelsTab', '@/views/admin/CmsTabs');
createPage('value-stack', 'ValueStackTab', '@/views/admin/CmsTabs');
createPage('coupons', 'CouponsTab', '@/views/admin/CmsTabs');
