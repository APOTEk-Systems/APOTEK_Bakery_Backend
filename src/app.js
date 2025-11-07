//@ts-check

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import productModule from './modules/products/index.js';
import userModule from './modules/users/index.js';
import customerModule from './modules/customers/index.js';
import saleModule from './modules/sales/index.js';
import purchaseModule from './modules/purchases/index.js';
import inventoryModule from './modules/inventory/index.js';
import accountingModule from './modules/accounting/index.js';
import productionModule from './modules/production/index.js';
import reportingModule from './modules/reporting/index.js';
import settingsModule from './modules/settings/index.js';
import authModule from './modules/auth/index.js';
import supplierModule from './modules/suppliers/index.js';
import adjustmentsModule from './modules/adjustments/index.js';
import dashboardModule from './modules/dashboard/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import swaggerUiDist from 'swagger-ui-dist';

const app = express();

// Global middleware
const allowedOrigins = ['https://pastry-pros-suite.vercel.app','http://localhost:4173', 'http://localhost:8000', 'http://localhost:8080', 'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



// Mount module routes
app.use('/api/auth', authModule);
app.use('/api/products', productModule);
app.use('/api/users', userModule);
app.use('/api/customers', customerModule);
app.use('/api/sales', saleModule);
app.use('/api/purchases', purchaseModule);
app.use('/api/inventory', inventoryModule);
app.use('/api/adjustments', adjustmentsModule);
app.use('/api/accounting', accountingModule); 
app.use('/api/production', productionModule);
app.use('/api/reports', reportingModule);
app.use('/api/settings', settingsModule);
app.use('/api/suppliers', supplierModule);
app.use('/api/dashboard', dashboardModule);

const swaggerAssetPath = swaggerUiDist.getAbsoluteFSPath();
app.use('/api-docs-assets', express.static(swaggerAssetPath));

// Use Swagger UI with local assets
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: '/api-docs-assets/swagger-ui.css',
    customJs: '/api-docs-assets/swagger-ui-bundle.js',
    customfavIcon: '/api-docs-assets/favicon-32x32.png',
    customSiteTitle: 'My API Docs',
  })
);


export default app;