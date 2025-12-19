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
import salesAdjustmentModule from './modules/salesAdjustments/index.js';
import productAdjustmentModule from './modules/productAdjustments/index.js';
import dashboardModule from './modules/dashboard/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import swaggerUiDist from 'swagger-ui-dist';

const app = express();

// Global middleware
const allowedOrigins = ['https://pastry-pros-suite.vercel.app','http://localhost:4173', 'http://localhost:8000', 'http://localhost:8080', 'http://localhost:3000', 'https://bakery.apotek.co.tz'];
const corsOptions = {
  origin: (/** @type {string} */ origin, /** @type {(arg0: Error | null, arg1: boolean | undefined) => void} */ callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      // @ts-ignore
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// @ts-ignore
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
app.use('/api/sales-adjustments', salesAdjustmentModule);
app.use('/api/product-adjustments', productAdjustmentModule);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    // You can still pass custom options, but
    // customCssUrl, customJs, and customfavIcon paths are handled internally
    // to point to the correct bundled assets.
    customSiteTitle: 'Pastry Pro API Documentation',
    // Example of a custom CSS file path if you placed it in your public folder:
    // customCssUrl: '/public/custom.css'
  })
);


export default app;