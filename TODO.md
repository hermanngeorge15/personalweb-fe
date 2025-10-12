# WriteWave Frontend - Modular Topics System TODO

## Current State Analysis

### ✅ What's Already Implemented
- **Basic routing structure** with TanStack Router
- **Authentication** with Keycloak integration
- **Basic CRUD patterns** for Tasks (most complete)
- **UI components** using HeroUI and Tailwind
- **Data fetching** with TanStack Query
- **Form handling** with React Hook Form + Zod
- **Topics management** (basic area configuration)
- **API integration** with flexible backend routing
- **Mocking** with MSW for development

### 🔍 Current Architecture Gaps
- **Inconsistent patterns** across entity types (Tasks vs Bonsai vs Car)
- **No unified CRUD abstraction** for different topics
- **Limited detail views** (only Tasks have full detail pages)
- **No generic table/list components** for reusability
- **Missing OpenAPI client integration** (despite having OpenAPI spec)
- **Incomplete query key management** for different entities
- **No standardized error handling** across features

---

## Phase 1: Foundation & Architecture (Priority: HIGH)

### 1.1 OpenAPI Client Integration
- [ ] **Generate TypeScript client** from existing OpenAPI spec
  - [ ] Set up OpenAPI generator configuration
  - [ ] Generate client for all entity types (Tasks, Bonsai, Car, Pet, General)
  - [ ] Create typed API client wrapper with auth integration
  - [ ] Replace manual API calls with generated client

### 1.2 Generic Entity System Architecture
- [ ] **Create base entity interfaces**
  - [ ] `BaseEntity` interface with common fields (id, createdAt, updatedAt, ownerId)
  - [ ] `EntityConfig` type for topic configuration
  - [ ] `EntityFilters` generic type for filtering
  - [ ] `EntityFormData` generic type for forms

- [ ] **Implement generic repository pattern**
  - [ ] `BaseRepository<T>` interface with CRUD operations
  - [ ] `HttpRepository<T>` implementation using generated client
  - [ ] Entity-specific repository factories

- [ ] **Create generic query key system**
  - [ ] `createEntityKeys(entityType)` factory function
  - [ ] Standardized query key patterns for all entities
  - [ ] Update existing query keys to use new system

### 1.3 Generic UI Component System
- [ ] **Create reusable table component**
  - [ ] `EntityTable<T>` with configurable columns
  - [ ] Built-in actions (view, edit, delete)
  - [ ] Sorting and filtering capabilities
  - [ ] Pagination support

- [ ] **Create generic form component**
  - [ ] `EntityForm<T>` with dynamic field rendering
  - [ ] Integration with React Hook Form + Zod
  - [ ] Field type mapping (text, number, date, select, etc.)
  - [ ] Validation schema generation

- [ ] **Create detail view components**
  - [ ] `EntityDetail<T>` with configurable sections
  - [ ] `EntityDetailHeader` with actions
  - [ ] `EntityDetailContent` with tabs/sections
  - [ ] `EntityDetailSidebar` for metadata

---

## Phase 2: Topic Configuration System (Priority: HIGH)

### 2.1 Enhanced Topic Management
- [ ] **Extend topics configuration**
  - [ ] Add API endpoint configuration per topic
  - [ ] Define field schemas for each topic
  - [ ] Configure list/detail view layouts
  - [ ] Set up validation rules per topic

- [ ] **Create topic registry**
  - [ ] `TopicRegistry` class for managing topic configurations
  - [ ] Dynamic topic discovery from configuration
  - [ ] Topic-specific route generation
  - [ ] Validation of topic configurations

### 2.2 Dynamic Routing System
- [ ] **Implement dynamic route generation**
  - [ ] Generate routes based on topic configuration
  - [ ] Create generic list/detail/new/edit routes
  - [ ] Handle topic-specific sub-routes (e.g., logs, activities)
  - [ ] Update route tree generation

- [ ] **Create topic-specific route components**
  - [ ] `TopicListPage` component
  - [ ] `TopicDetailPage` component
  - [ ] `TopicNewPage` component
  - [ ] `TopicEditPage` component

---

## Phase 3: Entity-Specific Implementations (Priority: MEDIUM)

### 3.1 Standardize Existing Entities
- [ ] **Refactor Tasks implementation**
  - [ ] Migrate to generic entity system
  - [ ] Update to use generated API client
  - [ ] Implement proper error handling
  - [ ] Add comprehensive detail view

- [ ] **Refactor Bonsai implementation**
  - [ ] Complete CRUD operations
  - [ ] Add detail view with sub-entities (waterings, prunings, etc.)
  - [ ] Implement schedule management
  - [ ] Add health tracking features

- [ ] **Refactor Car implementation**
  - [ ] Complete CRUD operations
  - [ ] Add detail view with sub-entities (trips, fuel, maintenance)
  - [ ] Implement service tracking
  - [ ] Add expense management

### 3.2 Add New Entity Types
- [ ] **Implement Pet management**
  - [ ] Create Pet entity types and schemas
  - [ ] Implement CRUD operations
  - [ ] Add sub-entities (feeding, medication, vet visits, weight)
  - [ ] Create pet-specific UI components

- [ ] **Implement General Items**
  - [ ] Create GeneralItem entity types
  - [ ] Implement CRUD operations
  - [ ] Add notes sub-entity
  - [ ] Create general-purpose UI

---

## Phase 4: Advanced Features (Priority: MEDIUM)

### 4.1 Enhanced UI/UX
- [ ] **Implement advanced filtering**
  - [ ] Multi-field filter system
  - [ ] Saved filter presets
  - [ ] Advanced search capabilities
  - [ ] Filter persistence in URL

- [ ] **Add bulk operations**
  - [ ] Multi-select functionality
  - [ ] Bulk edit capabilities
  - [ ] Bulk delete with confirmation
  - [ ] Bulk export/import

- [ ] **Implement data visualization**
  - [ ] Charts for entity metrics
  - [ ] Timeline views for activities
  - [ ] Dashboard widgets
  - [ ] Export to various formats

### 4.2 Performance & Scalability
- [ ] **Implement virtualization**
  - [ ] Virtual scrolling for large lists
  - [ ] Lazy loading for detail views
  - [ ] Image optimization and lazy loading
  - [ ] Code splitting per topic

- [ ] **Add caching strategies**
  - [ ] Implement optimistic updates
  - [ ] Add offline support with service workers
  - [ ] Cache invalidation strategies
  - [ ] Background sync capabilities

---

## Phase 5: Developer Experience (Priority: LOW)

### 5.1 Development Tools
- [ ] **Create development utilities**
  - [ ] Entity generator CLI tool
  - [ ] Topic configuration validator
  - [ ] API client testing utilities
  - [ ] Component playground

- [ ] **Improve documentation**
  - [ ] API documentation generation
  - [ ] Component storybook
  - [ ] Architecture decision records
  - [ ] Developer onboarding guide

### 5.2 Testing & Quality
- [ ] **Implement comprehensive testing**
  - [ ] Unit tests for generic components
  - [ ] Integration tests for entity operations
  - [ ] E2E tests for critical user flows
  - [ ] Visual regression testing

- [ ] **Add monitoring and analytics**
  - [ ] Error tracking and reporting
  - [ ] Performance monitoring
  - [ ] User analytics
  - [ ] API usage tracking

---

## Implementation Notes

### Technical Decisions
- **Use OpenAPI client** instead of manual API calls for type safety
- **Implement generic patterns** to reduce code duplication
- **Maintain backward compatibility** during migration
- **Use feature flags** for gradual rollout of new features
- **Follow existing code style** and patterns where possible

### Migration Strategy
1. **Phase 1** can be implemented alongside existing code
2. **Phase 2** requires careful coordination with routing changes
3. **Phase 3** involves gradual migration of existing entities
4. **Phase 4-5** are enhancements that can be added incrementally

### Success Criteria
- [ ] All entity types follow the same patterns
- [ ] New topics can be added with minimal code
- [ ] UI components are reusable across topics
- [ ] API integration is type-safe and consistent
- [ ] Performance is maintained or improved
- [ ] Developer experience is significantly improved

---

## Quick Start Checklist

For immediate next steps, focus on:

1. **Set up OpenAPI client generation** (Phase 1.1)
2. **Create base entity interfaces** (Phase 1.2)
3. **Implement generic table component** (Phase 1.3)
4. **Refactor Tasks to use new patterns** (Phase 3.1)
5. **Test the new system with a simple topic** (Phase 2.1)

This will provide a solid foundation for the modular topics system while maintaining the existing functionality.
