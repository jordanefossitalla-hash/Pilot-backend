const swaggerJSDoc = require('swagger-jsdoc');

const bearerAuth = [{ bearerAuth: [] }];

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Pilot Backend API',
    version: '1.0.0',
    description: 'Documentation du backend de Pilot avec auth, utilisateurs, tiers et inventaire.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Account creation and authentication' },
    { name: 'Users', description: 'User management' },
    { name: 'Tiers', description: 'Customers, suppliers and their balances' },
    { name: 'Inventory', description: 'Products and supplier stock receipts' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Invalid credentials.'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
        properties: {
          firstName: { type: 'string', example: 'Admin' },
          lastName: { type: 'string', example: 'Pilot' },
          email: { type: 'string', format: 'email', example: 'admin@pilot.local' },
          phone: { type: 'string', nullable: true, example: '+2250700000000' },
          password: { type: 'string', format: 'password', example: 'Admin1234' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@pilot.local' },
          password: { type: 'string', format: 'password', example: 'Admin1234' }
        }
      },
      AuthUser: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cmabc1234567890' },
          firstName: { type: 'string', example: 'Admin' },
          lastName: { type: 'string', example: 'Pilot' },
          email: { type: 'string', format: 'email', example: 'admin@pilot.local' },
          phone: { type: 'string', nullable: true, example: '+2250700000000' },
          role: { type: 'string', example: 'ADMIN' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/AuthUser' }
        }
      },
      UserListResponse: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: { $ref: '#/components/schemas/AuthUser' }
          }
        }
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'Jordan' },
          lastName: { type: 'string', example: 'Admin' },
          email: { type: 'string', format: 'email', example: 'jordan@pilot.local' },
          phone: { type: 'string', nullable: true, example: '+2250700000000' }
        }
      },
      UpdateStatusRequest: {
        type: 'object',
        required: ['isActive'],
        properties: {
          isActive: { type: 'boolean', example: false }
        }
      },
      Tier: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cmtiers123' },
          name: { type: 'string', example: 'Entreprise Demo' },
          type: { type: 'string', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'], example: 'SUPPLIER' },
          phone: { type: 'string', nullable: true, example: '+2250102030405' },
          email: { type: 'string', format: 'email', nullable: true, example: 'contact@demo.ci' },
          address: { type: 'string', nullable: true, example: 'Abidjan, Cocody' },
          isActive: { type: 'boolean', example: true },
          balance: { type: 'number', example: 250000 },
          balanceDirection: { type: 'string', enum: ['DEBIT', 'CREDIT', 'SETTLED'], example: 'CREDIT' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      TierListResponse: {
        type: 'object',
        properties: {
          tiers: {
            type: 'array',
            items: { $ref: '#/components/schemas/Tier' }
          }
        }
      },
      CreateTierRequest: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          name: { type: 'string', example: 'Grossiste CI' },
          type: { type: 'string', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'], example: 'SUPPLIER' },
          phone: { type: 'string', nullable: true, example: '+2250102030405' },
          email: { type: 'string', format: 'email', nullable: true, example: 'contact@grossiste.ci' },
          address: { type: 'string', nullable: true, example: 'Abidjan, Zone 4' },
          openingBalance: { type: 'number', example: 100000 },
          openingBalanceDirection: { type: 'string', enum: ['DEBIT', 'CREDIT'], example: 'CREDIT' },
          openingBalanceReference: { type: 'string', nullable: true, example: 'SOLDE-OUVERTURE-001' },
          openingBalanceDescription: { type: 'string', nullable: true, example: 'Solde initial fournisseur' }
        }
      },
      UpdateTierRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Grossiste CI Modifie' },
          type: { type: 'string', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'], example: 'BOTH' },
          phone: { type: 'string', nullable: true, example: '+2250102030405' },
          email: { type: 'string', format: 'email', nullable: true, example: 'contact@grossiste.ci' },
          address: { type: 'string', nullable: true, example: 'Abidjan, Zone 4' }
        }
      },
      TierLedgerEntry: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cmentry123' },
          entryType: { type: 'string', enum: ['OPENING_BALANCE', 'PAYMENT_IN', 'PAYMENT_OUT', 'PURCHASE_RECEIPT', 'MANUAL_ADJUSTMENT'] },
          direction: { type: 'string', enum: ['DEBIT', 'CREDIT'] },
          amount: { type: 'number', example: 50000 },
          reference: { type: 'string', nullable: true, example: 'VERSEMENT-001' },
          description: { type: 'string', nullable: true, example: 'Versement fournisseur' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      TierLedgerListResponse: {
        type: 'object',
        properties: {
          tier: { $ref: '#/components/schemas/Tier' },
          entries: {
            type: 'array',
            items: { $ref: '#/components/schemas/TierLedgerEntry' }
          }
        }
      },
      CreateTierLedgerEntryRequest: {
        type: 'object',
        required: ['entryType', 'direction', 'amount'],
        properties: {
          entryType: { type: 'string', enum: ['OPENING_BALANCE', 'PAYMENT_IN', 'PAYMENT_OUT', 'MANUAL_ADJUSTMENT'], example: 'PAYMENT_OUT' },
          direction: { type: 'string', enum: ['DEBIT', 'CREDIT'], example: 'DEBIT' },
          amount: { type: 'number', example: 50000 },
          reference: { type: 'string', nullable: true, example: 'PAY-001' },
          description: { type: 'string', nullable: true, example: 'Versement fournisseur' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cmproduct123' },
          name: { type: 'string', example: 'Riz 25kg' },
          sku: { type: 'string', nullable: true, example: 'RIZ-25' },
          unit: { type: 'string', example: 'SAC' },
          stockQuantity: { type: 'number', example: 125 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      ProductListResponse: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          }
        }
      },
      CreateProductRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Riz 25kg' },
          sku: { type: 'string', nullable: true, example: 'RIZ-25' },
          unit: { type: 'string', example: 'SAC' }
        }
      },
      UpdateProductRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Riz 50kg' },
          sku: { type: 'string', nullable: true, example: 'RIZ-50' },
          unit: { type: 'string', example: 'SAC' }
        }
      },
      StockEntryItemRequest: {
        type: 'object',
        required: ['productId', 'quantity', 'unitPrice'],
        properties: {
          productId: { type: 'string', example: 'cmproduct123' },
          quantity: { type: 'number', example: 10 },
          unitPrice: { type: 'number', example: 15000 }
        }
      },
      StockEntryItem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cmitem123' },
          productId: { type: 'string', example: 'cmproduct123' },
          product: { $ref: '#/components/schemas/Product' },
          quantity: { type: 'number', example: 10 },
          unitPrice: { type: 'number', example: 15000 },
          lineTotal: { type: 'number', example: 150000 }
        }
      },
      StockEntry: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cmentry123' },
          supplierId: { type: 'string', example: 'cmtiers123' },
          reference: { type: 'string', nullable: true, example: 'BE-001' },
          entryDate: { type: 'string', format: 'date-time' },
          notes: { type: 'string', nullable: true, example: 'Livraison fournisseur' },
          totalAmount: { type: 'number', example: 250000 },
          supplier: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string' }
            }
          },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/StockEntryItem' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      StockEntryListResponse: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            items: { $ref: '#/components/schemas/StockEntry' }
          }
        }
      },
      CreateStockEntryRequest: {
        type: 'object',
        required: ['supplierId', 'items'],
        properties: {
          supplierId: { type: 'string', example: 'cmtiers123' },
          reference: { type: 'string', nullable: true, example: 'BE-001' },
          entryDate: { type: 'string', format: 'date-time', nullable: true },
          notes: { type: 'string', nullable: true, example: 'Reception du jour' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/StockEntryItemRequest' }
          }
        }
      }
    }
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create an account',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
        responses: {
          '201': { description: 'Account created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'Email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: {
          '200': { description: 'Authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user',
        security: bearerAuth,
        responses: {
          '200': { description: 'Authenticated user', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/AuthUser' } } } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        security: bearerAuth,
        responses: {
          '200': { description: 'Users list', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserListResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get one user',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'User found', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/AuthUser' } } } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Update a user',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } } },
        responses: {
          '200': { description: 'User updated', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/AuthUser' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'Email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/users/{id}/status': {
      patch: {
        tags: ['Users'],
        summary: 'Activate or deactivate a user',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStatusRequest' } } } },
        responses: {
          '200': { description: 'User status updated', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/AuthUser' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/tiers': {
      get: {
        tags: ['Tiers'],
        summary: 'List tiers with balances',
        security: bearerAuth,
        parameters: [{ name: 'type', in: 'query', required: false, schema: { type: 'string', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] } }],
        responses: {
          '200': { description: 'Tiers list', content: { 'application/json': { schema: { $ref: '#/components/schemas/TierListResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Tiers'],
        summary: 'Create a tier with optional opening balance',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTierRequest' } } } },
        responses: {
          '201': { description: 'Tier created', content: { 'application/json': { schema: { type: 'object', properties: { tier: { $ref: '#/components/schemas/Tier' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/tiers/{id}': {
      get: {
        tags: ['Tiers'],
        summary: 'Get one tier',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Tier found', content: { 'application/json': { schema: { type: 'object', properties: { tier: { $ref: '#/components/schemas/Tier' } } } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Tier not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      patch: {
        tags: ['Tiers'],
        summary: 'Update a tier',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTierRequest' } } } },
        responses: {
          '200': { description: 'Tier updated', content: { 'application/json': { schema: { type: 'object', properties: { tier: { $ref: '#/components/schemas/Tier' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Tier not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/tiers/{id}/status': {
      patch: {
        tags: ['Tiers'],
        summary: 'Activate or deactivate a tier',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStatusRequest' } } } },
        responses: {
          '200': { description: 'Tier status updated', content: { 'application/json': { schema: { type: 'object', properties: { tier: { $ref: '#/components/schemas/Tier' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Tier not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/tiers/{id}/ledger-entries': {
      get: {
        tags: ['Tiers'],
        summary: 'List ledger entries for one tier',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Tier ledger entries', content: { 'application/json': { schema: { $ref: '#/components/schemas/TierLedgerListResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Tier not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Tiers'],
        summary: 'Create a manual ledger entry or payment for a tier',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTierLedgerEntryRequest' } } } },
        responses: {
          '201': { description: 'Ledger entry created', content: { 'application/json': { schema: { type: 'object', properties: { tier: { $ref: '#/components/schemas/Tier' }, entry: { $ref: '#/components/schemas/TierLedgerEntry' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Tier not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/inventory/products': {
      get: {
        tags: ['Inventory'],
        summary: 'List products',
        security: bearerAuth,
        responses: {
          '200': { description: 'Products list', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductListResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Inventory'],
        summary: 'Create a product',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProductRequest' } } } },
        responses: {
          '201': { description: 'Product created', content: { 'application/json': { schema: { type: 'object', properties: { product: { $ref: '#/components/schemas/Product' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'SKU already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/inventory/products/{id}': {
      get: {
        tags: ['Inventory'],
        summary: 'Get one product',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Product found', content: { 'application/json': { schema: { type: 'object', properties: { product: { $ref: '#/components/schemas/Product' } } } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      patch: {
        tags: ['Inventory'],
        summary: 'Update a product',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProductRequest' } } } },
        responses: {
          '200': { description: 'Product updated', content: { 'application/json': { schema: { type: 'object', properties: { product: { $ref: '#/components/schemas/Product' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'SKU already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/inventory/products/{id}/status': {
      patch: {
        tags: ['Inventory'],
        summary: 'Activate or deactivate a product',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStatusRequest' } } } },
        responses: {
          '200': { description: 'Product status updated', content: { 'application/json': { schema: { type: 'object', properties: { product: { $ref: '#/components/schemas/Product' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/inventory/stock-entries': {
      get: {
        tags: ['Inventory'],
        summary: 'List supplier stock receipts',
        security: bearerAuth,
        responses: {
          '200': { description: 'Stock entries list', content: { 'application/json': { schema: { $ref: '#/components/schemas/StockEntryListResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Inventory'],
        summary: 'Create a supplier stock receipt',
        security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateStockEntryRequest' } } } },
        responses: {
          '201': { description: 'Stock entry created', content: { 'application/json': { schema: { type: 'object', properties: { entry: { $ref: '#/components/schemas/StockEntry' } } } } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Supplier or product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/v1/inventory/stock-entries/{id}': {
      get: {
        tags: ['Inventory'],
        summary: 'Get one supplier stock receipt',
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Stock entry found', content: { 'application/json': { schema: { type: 'object', properties: { entry: { $ref: '#/components/schemas/StockEntry' } } } } } },
          '401': { description: 'Missing or invalid token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Stock entry not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  }
};

module.exports = swaggerJSDoc({ definition: swaggerDefinition, apis: [] });