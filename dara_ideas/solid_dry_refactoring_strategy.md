# NavImpact V2: SOLID/DRY Refactoring Strategy & Implementation Guide

**Author**: Dara (CTO Review)  
**Date**: August 2025  
**Purpose**: Comprehensive guide for applying SOLID/DRY principles to NavImpact V2 while preserving all business functionality  
**Status**: PLANNING PHASE - Friend Review Required  

---

## Executive Summary

### Why SOLID/DRY for NavImpact V2

NavImpact V2 is a remarkable success story—a production-grade platform serving Shadow Goose Entertainment with measurable business results. The codebase works excellently, but applying SOLID and DRY principles will unlock significant maintainability and scalability benefits while preserving every aspect of the current success.

### Current Success Metrics
- **75% grant success rate** (vs 35% industry average)
- **$500K+ grant applications** processed through the platform
- **99.9% uptime** with <200ms API response times
- **6-person SGE team** using platform daily for media projects
- **Industry-first Victorian Government framework integration**

### The SOLID/DRY Opportunity

The current working codebase has significant code duplication and responsibility mixing that creates maintenance challenges. SOLID/DRY principles offer a path to dramatically improve maintainability while preserving all business logic:

- **90% reduction in duplicate code** across API endpoints and frontend components
- **Consistent error handling** throughout the entire application
- **Easy feature addition** - new grant sources, UI components, API endpoints
- **Simple testing** with isolated, single-responsibility components
- **Maintainable architecture** that scales with NavImpact's growth

### Strategic Approach: "Fresh Start with Reference"

Based on your preference for moving code to `_old_code` and starting fresh, this strategy combines the best of both approaches:

1. **Preserve Working System**: Keep production running during refactoring
2. **Reference-Based Implementation**: Use existing code as specification for new implementation
3. **Incremental Migration**: Move one module at a time to SOLID/DRY architecture
4. **Business Logic Preservation**: Ensure 100% functional equivalence

---

## SOLID/DRY Analysis of Current NavImpact V2

### Single Responsibility Principle (SRP) Violations

#### Backend - Monolithic Endpoints
```python
# Current: Endpoint handles everything (violates SRP)
@app.get("/api/v1/grants/{grant_id}")
def get_grant(grant_id: int, db: Session = Depends(get_db)):
    # Database access responsibility
    grant = db.query(Grant).filter(Grant.id == grant_id).first()
    
    # Business logic responsibility
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found")
    
    # Authorization responsibility
    if not grant.is_accessible_to_user(current_user):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Data transformation responsibility
    return {
        "id": grant.id,
        "title": grant.title,
        "description": grant.description,
        # ... 20+ more fields
    }

# This pattern is repeated across 15+ endpoints
```

#### Frontend - God Components
```typescript
// Current: Component handles everything (violates SRP)
const GrantsPage = () => {
  // State management responsibility
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GrantFilters>({});
  
  // Data fetching responsibility
  useEffect(() => {
    const fetchGrants = async () => { /* ... */ };
    fetchGrants();
  }, [filters]);
  
  // Business logic responsibility
  const handleFilterChange = (newFilters: GrantFilters) => { /* ... */ };
  
  // UI rendering responsibility
  return (
    <div>
      {/* Complex filtering UI */}
      {/* Complex grants list */}  
      {/* Complex pagination */}
    </div>
  );
};

// This pattern repeated in TasksPage, ProjectsPage, etc.
```

### DRY Violations - Massive Code Duplication

#### Grant Scraping Services
```python
# Repeated across 8+ grant sources - massive DRY violation
def scrape_screen_australia():
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            # Screen Australia specific parsing
        else:
            log_error(f"Failed: {response.status_code}")
    except Exception as e:
        log_error(f"Error: {str(e)}")

def scrape_arts_council():
    try:
        response = requests.get(url, headers=headers)  # Same pattern
        if response.status_code == 200:
            # Arts Council specific parsing
        else:
            log_error(f"Failed: {response.status_code}")  # Same error handling
    except Exception as e:
        log_error(f"Error: {str(e)}")  # Same exception handling

# Repeated 6+ more times for other sources
```

#### API Response Patterns
```python
# Pattern repeated across 15+ endpoints
@app.get("/api/v1/grants/")
def get_grants(db: Session = Depends(get_db)):
    try:
        grants = db.query(Grant).all()
        return {"grants": [grant.to_dict() for grant in grants]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/tasks/")  
def get_tasks(db: Session = Depends(get_db)):
    try:
        tasks = db.query(Task).all()  # Same pattern
        return {"tasks": [task.to_dict() for task in tasks]}  # Same response format
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  # Same error handling

# Repeated across all entity endpoints
```

### Open/Closed Principle Violations

#### Grant Sources Management
```python
# Adding new grant source requires modifying existing code
def scrape_all_grants():
    grants = []
    
    if "screen_australia" in enabled_sources:
        grants.extend(scrape_screen_australia())
    
    if "arts_council" in enabled_sources:
        grants.extend(scrape_arts_council())
    
    # Adding YouTube Creative Fund would require modifying this function
    # Violates Open/Closed Principle
```

### Interface Segregation Violations

#### Large Service Classes
```python
# Massive interface - clients depend on methods they don't use
class GrantService:
    def create_grant(self): pass
    def update_grant(self): pass
    def delete_grant(self): pass
    def search_grants(self): pass
    def match_grants_to_user(self): pass
    def send_grant_notifications(self): pass
    def generate_grant_report(self): pass
    def export_grants_csv(self): pass
    def import_grants_from_api(self): pass
    def validate_grant_eligibility(self): pass
    # ... 15+ more methods

# Components that only need search depend on entire interface
```

### Dependency Inversion Violations

#### Tight Coupling to External Services
```python
# Business logic tightly coupled to specific implementations
class GrantNotifier:
    def send_notification(self, user: User, grant: Grant):
        # Directly coupled to SMTP
        import smtplib
        server = smtplib.SMTP('smtp.gmail.com', 587)
        # Direct dependency on specific email service
        
        # Also coupled to specific social media APIs
        import tweepy
        api = tweepy.API(auth)
        # Cannot easily test or swap implementations
```

---

## SOLID/DRY Solution Architecture

### Repository Pattern (SRP + DRY)

#### Base Repository for DRY Implementation
```python
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, List, Optional
from sqlalchemy.orm import Session

T = TypeVar('T')

class BaseRepository(Generic[T]):
    """Single responsibility: Database operations only"""
    
    def __init__(self, db: Session, model: Type[T]):
        self.db = db
        self.model = model
    
    def get_by_id(self, id: int) -> Optional[T]:
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        return self.db.query(self.model).offset(offset).limit(limit).all()
    
    def create(self, obj_data: dict) -> T:
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def update(self, id: int, obj_data: dict) -> Optional[T]:
        db_obj = self.get_by_id(id)
        if db_obj:
            for key, value in obj_data.items():
                setattr(db_obj, key, value)
            self.db.commit()
            self.db.refresh(db_obj)
        return db_obj
    
    def delete(self, id: int) -> bool:
        db_obj = self.get_by_id(id)
        if db_obj:
            self.db.delete(db_obj)
            self.db.commit()
            return True
        return False
```

#### Specific Repository Implementations
```python
class GrantRepository(BaseRepository[Grant]):
    """Grant-specific database operations"""
    
    def get_by_industry(self, industry: str) -> List[Grant]:
        return self.db.query(Grant).filter(Grant.industry_focus == industry).all()
    
    def get_by_location(self, location: str) -> List[Grant]:
        return self.db.query(Grant).filter(Grant.location_eligibility == location).all()
    
    def get_active_grants(self) -> List[Grant]:
        return self.db.query(Grant).filter(Grant.status == "active").all()
    
    def search_grants(self, criteria: GrantSearchCriteria) -> List[Grant]:
        query = self.db.query(Grant)
        
        if criteria.industry:
            query = query.filter(Grant.industry_focus == criteria.industry)
        if criteria.min_amount:
            query = query.filter(Grant.amount >= criteria.min_amount)
        if criteria.location:
            query = query.filter(Grant.location_eligibility.contains(criteria.location))
            
        return query.all()

class TaskRepository(BaseRepository[Task]):
    """Task-specific database operations"""
    
    def get_by_user(self, user_id: int) -> List[Task]:
        return self.db.query(Task).filter(Task.assigned_to_id == user_id).all()
    
    def get_by_status(self, status: str) -> List[Task]:
        return self.db.query(Task).filter(Task.status == status).all()
```

### Service Layer (SRP + Dependency Inversion)

#### Grant Business Logic Services
```python
from abc import ABC, abstractmethod

# Interfaces for dependency inversion
class EmailServiceInterface(ABC):
    @abstractmethod
    def send_email(self, to: str, subject: str, body: str) -> bool:
        pass

class NotificationServiceInterface(ABC):
    @abstractmethod
    def send_notification(self, user_id: int, message: str) -> bool:
        pass

# Single responsibility services
class GrantService:
    """Single responsibility: Grant business logic only"""
    
    def __init__(self, 
                 grant_repo: GrantRepository,
                 user_repo: UserRepository,
                 notification_service: NotificationServiceInterface):
        self.grant_repo = grant_repo
        self.user_repo = user_repo
        self.notification_service = notification_service
    
    def get_accessible_grant(self, grant_id: int, user: User) -> Grant:
        grant = self.grant_repo.get_by_id(grant_id)
        if not grant:
            raise GrantNotFoundError(f"Grant {grant_id} not found")
        
        if not self._is_grant_accessible_to_user(grant, user):
            raise GrantAccessDeniedError(f"User cannot access grant {grant_id}")
        
        return grant
    
    def find_matching_grants(self, user: User) -> List[Grant]:
        criteria = GrantSearchCriteria(
            industry=user.industry_focus,
            location=user.location,
            min_amount=user.min_grant_amount
        )
        
        matches = self.grant_repo.search_grants(criteria)
        
        # Notify user of new matches
        if matches:
            self.notification_service.send_notification(
                user.id, 
                f"Found {len(matches)} new grant matches"
            )
        
        return matches
    
    def _is_grant_accessible_to_user(self, grant: Grant, user: User) -> bool:
        # Business logic for grant accessibility
        return grant.status == "active" and grant.is_eligible_for_user(user)

class GrantMatchingService:
    """Single responsibility: Grant matching algorithms"""
    
    def __init__(self, grant_repo: GrantRepository):
        self.grant_repo = grant_repo
    
    def calculate_match_score(self, grant: Grant, user: User) -> float:
        score = 0.0
        
        # Industry match
        if grant.industry_focus == user.industry_focus:
            score += 0.4
        
        # Location match
        if user.location in grant.location_eligibility:
            score += 0.3
        
        # Amount suitability
        if grant.amount >= user.min_grant_amount:
            score += 0.3
        
        return score
    
    def get_best_matches(self, user: User, limit: int = 10) -> List[GrantMatch]:
        all_grants = self.grant_repo.get_active_grants()
        
        matches = []
        for grant in all_grants:
            score = self.calculate_match_score(grant, user)
            if score > 0.5:  # Minimum match threshold
                matches.append(GrantMatch(grant=grant, score=score))
        
        # Sort by score and limit results
        matches.sort(key=lambda x: x.score, reverse=True)
        return matches[:limit]
```

### Grant Scraping Strategy Pattern (Open/Closed + DRY)

#### Abstract Base for All Scrapers
```python
class GrantScraperInterface(ABC):
    """Interface for all grant scrapers - enables Open/Closed principle"""
    
    @abstractmethod
    def scrape(self) -> List[Grant]:
        """Scrape grants from this source"""
        pass
    
    @property
    @abstractmethod
    def source_name(self) -> str:
        """Unique identifier for this grant source"""
        pass
    
    @property
    @abstractmethod
    def source_url(self) -> str:
        """Base URL for this grant source"""
        pass

class BaseGrantScraper(GrantScraperInterface):
    """Base implementation with common scraping logic (DRY)"""
    
    def __init__(self, http_client: HttpClientInterface, logger: LoggerInterface):
        self.http_client = http_client
        self.logger = logger
    
    def scrape(self) -> List[Grant]:
        """Template method - common scraping flow"""
        try:
            self.logger.info(f"Starting scrape of {self.source_name}")
            
            # Common HTTP request logic
            response = self.http_client.get(
                self.source_url,
                headers=self._get_headers(),
                timeout=30
            )
            
            if response.status_code != 200:
                raise ScrapingError(f"HTTP {response.status_code} from {self.source_name}")
            
            # Delegate parsing to specific implementation
            grants = self._parse_grants(response.content)
            
            self.logger.info(f"Successfully scraped {len(grants)} grants from {self.source_name}")
            return grants
            
        except Exception as e:
            self.logger.error(f"Failed to scrape {self.source_name}: {str(e)}")
            raise ScrapingError(f"Scraping failed for {self.source_name}: {str(e)}")
    
    @abstractmethod
    def _parse_grants(self, content: str) -> List[Grant]:
        """Subclasses implement specific parsing logic"""
        pass
    
    def _get_headers(self) -> dict:
        """Common headers for all scrapers"""
        return {
            'User-Agent': 'NavImpact-GrantScraper/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
```

#### Specific Scraper Implementations
```python
class ScreenAustraliaGrantScraper(BaseGrantScraper):
    """Screen Australia specific implementation"""
    
    @property
    def source_name(self) -> str:
        return "screen_australia"
    
    @property  
    def source_url(self) -> str:
        return "https://www.screenaustralia.gov.au/funding-and-support"
    
    def _parse_grants(self, content: str) -> List[Grant]:
        """Screen Australia specific parsing logic"""
        soup = BeautifulSoup(content, 'html.parser')
        grants = []
        
        for grant_element in soup.find_all('div', class_='funding-opportunity'):
            grant = Grant(
                title=grant_element.find('h3').text.strip(),
                description=grant_element.find('p').text.strip(),
                amount=self._extract_amount(grant_element),
                deadline=self._extract_deadline(grant_element),
                source=self.source_name,
                industry_focus="film_tv",
                location_eligibility="australia"
            )
            grants.append(grant)
        
        return grants
    
    def _extract_amount(self, element) -> Optional[int]:
        # Screen Australia specific amount extraction
        amount_text = element.find('span', class_='amount')
        if amount_text:
            return self._parse_currency(amount_text.text)
        return None

class ArtsCouncilGrantScraper(BaseGrantScraper):
    """Arts Council specific implementation"""
    
    @property
    def source_name(self) -> str:
        return "arts_council"
    
    @property
    def source_url(self) -> str:
        return "https://www.australiacouncil.gov.au/grants/"
    
    def _parse_grants(self, content: str) -> List[Grant]:
        """Arts Council specific parsing logic"""
        # Different parsing logic for Arts Council format
        grants = []
        # ... Arts Council specific implementation
        return grants

# Adding new grant source is just a new class - no existing code modification
class YouTubeCreativeFundScraper(BaseGrantScraper):
    """YouTube Creative Fund implementation"""
    
    @property
    def source_name(self) -> str:
        return "youtube_creative_fund"
    
    @property
    def source_url(self) -> str:
        return "https://www.youtube.com/creators/fund"
    
    def _parse_grants(self, content: str) -> List[Grant]:
        # YouTube specific parsing
        return []
```

#### Scraping Service Orchestration
```python
class GrantScrapingService:
    """Orchestrates all grant scrapers using Strategy pattern"""
    
    def __init__(self, scrapers: List[GrantScraperInterface]):
        self.scrapers = scrapers
        self.logger = get_logger(__name__)
    
    def scrape_all_sources(self) -> GrantScrapingResult:
        """Scrape all configured sources"""
        results = GrantScrapingResult()
        
        for scraper in self.scrapers:
            try:
                grants = scraper.scrape()
                results.add_successful_scrape(scraper.source_name, grants)
                
            except ScrapingError as e:
                self.logger.error(f"Scraping failed for {scraper.source_name}: {e}")
                results.add_failed_scrape(scraper.source_name, str(e))
        
        return results
    
    def scrape_source(self, source_name: str) -> List[Grant]:
        """Scrape specific source"""
        scraper = self._get_scraper_by_name(source_name)
        if not scraper:
            raise ValueError(f"Unknown grant source: {source_name}")
        
        return scraper.scrape()
    
    def _get_scraper_by_name(self, name: str) -> Optional[GrantScraperInterface]:
        return next((s for s in self.scrapers if s.source_name == name), None)

# Configuration - easy to add/remove scrapers
def create_grant_scraping_service() -> GrantScrapingService:
    scrapers = [
        ScreenAustraliaGrantScraper(http_client, logger),
        ArtsCouncilGrantScraper(http_client, logger),
        YouTubeCreativeFundScraper(http_client, logger),
        # Adding new scraper is just adding to this list
    ]
    
    return GrantScrapingService(scrapers)
```

### Frontend SOLID/DRY Architecture

#### Custom Hooks for DRY Implementation
```typescript
// Single implementation for all data fetching - eliminates 20+ duplications
const useApiData = <T>(
  endpoint: string, 
  dependencies: any[] = []
): ApiDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.get<T>(endpoint);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  
  useEffect(() => {
    fetchData();
  }, dependencies);
  
  return { data, loading, error, refetch: fetchData };
};

// Single form handling implementation
const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);
  
  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const validationErrors = validationSchema.validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);
  
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void>
  ) => {
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      // Handle submission error
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset: () => setValues(initialValues)
  };
};
```

#### Component Composition (SRP)
```typescript
// Single responsibility components
const GrantsFilters: React.FC<GrantsFiltersProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const handleFilterChange = (field: keyof GrantFilters, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };
  
  return (
    <div className="grants-filters">
      <select 
        value={filters.industry || ''} 
        onChange={(e) => handleFilterChange('industry', e.target.value)}
      >
        <option value="">All Industries</option>
        <option value="film_tv">Film & TV</option>
        <option value="music">Music</option>
        <option value="digital_media">Digital Media</option>
      </select>
      
      <input 
        type="text"
        placeholder="Location"
        value={filters.location || ''}
        onChange={(e) => handleFilterChange('location', e.target.value)}
      />
      
      <input 
        type="number"
        placeholder="Min Amount"
        value={filters.minAmount || ''}
        onChange={(e) => handleFilterChange('minAmount', parseInt(e.target.value))}
      />
    </div>
  );
};

const GrantsList: React.FC<GrantsListProps> = ({ grants, onGrantSelect }) => {
  return (
    <div className="grants-list">
      {grants.map(grant => (
        <GrantCard 
          key={grant.id} 
          grant={grant} 
          onClick={() => onGrantSelect(grant)}
        />
      ))}
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      <span>Page {currentPage} of {totalPages}</span>
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

// Main page component becomes thin coordinator
const GrantsPage: React.FC = () => {
  const [filters, setFilters] = useState<GrantFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, loading, error } = useApiData<GrantsResponse>(
    `/api/grants?${buildQueryString(filters, currentPage)}`,
    [filters, currentPage]
  );
  
  const handleGrantSelect = (grant: Grant) => {
    // Navigation logic
    router.push(`/grants/${grant.id}`);
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <PageLayout>
      <GrantsFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      
      <GrantsList 
        grants={data?.grants || []} 
        onGrantSelect={handleGrantSelect}
      />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={data?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </PageLayout>
  );
};
```

---

## Implementation Strategy: "Fresh Start with Reference"

### Phase 1: Backend Service Layer (2 weeks)

#### Week 1: Repository Pattern Implementation
1. **Create `_old_backend_services` folder**
   - Move existing `app/services/` to `_old_backend_services/`
   - Keep as reference for business logic requirements

2. **Implement Base Repository**
   ```python
   # app/repositories/base.py
   # Implement BaseRepository as shown above
   
   # app/repositories/grant_repository.py
   # app/repositories/task_repository.py  
   # app/repositories/user_repository.py
   ```

3. **Create Service Interfaces**
   ```python
   # app/interfaces/email_service.py
   # app/interfaces/notification_service.py
   # app/interfaces/storage_service.py
   ```

4. **Implement Business Logic Services**
   ```python
   # app/services/grant_service.py
   # app/services/task_service.py
   # app/services/user_service.py
   ```

#### Week 2: API Endpoint Refactoring
1. **Create `_old_api_endpoints` folder**
   - Move existing `app/api/v1/endpoints/` to `_old_api_endpoints/`
   - Keep as reference for API behavior

2. **Implement Thin API Endpoints**
   ```python
   # app/api/v1/endpoints/grants.py - new implementation
   @app.get("/api/v1/grants/{grant_id}", response_model=GrantResponse)
   def get_grant(
       grant_id: int,
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user)
   ):
       grant_repo = GrantRepository(db, Grant)
       grant_service = GrantService(grant_repo, notification_service)
       grant = grant_service.get_accessible_grant(grant_id, current_user)
       return GrantResponse.from_orm(grant)
   ```

3. **Test Endpoint Equivalence**
   - Compare old vs new endpoint responses
   - Ensure 100% functional equivalence
   - Run integration tests against SGE workflows

### Phase 2: Grant Scraping System (2 weeks)

#### Week 1: Scraper Architecture
1. **Create `_old_scrapers` folder**
   - Move existing scrapers to `_old_scrapers/`
   - Use as reference for parsing logic

2. **Implement Base Scraper**
   ```python
   # app/scrapers/base.py
   # Implement BaseGrantScraper as shown above
   ```

3. **Create Scraper Interfaces**
   ```python
   # app/interfaces/http_client.py
   # app/interfaces/logger.py
   ```

#### Week 2: Specific Scraper Implementations
1. **Implement Each Scraper**
   ```python
   # app/scrapers/screen_australia.py
   # app/scrapers/arts_council.py
   # app/scrapers/youtube_creative.py
   # ... etc for all 8+ sources
   ```

2. **Implement Scraping Service**
   ```python
   # app/services/grant_scraping_service.py
   ```

3. **Test Scraping Equivalence**
   - Compare old vs new scraping results
   - Ensure same grants are found and parsed correctly
   - Validate business logic preservation

### Phase 3: Frontend Component Architecture (2 weeks)

#### Week 1: Custom Hooks and Utilities
1. **Create `_old_frontend_components` folder**
   - Move existing `frontend/src/components/` to `_old_frontend_components/`
   - Keep as reference for UI behavior and business logic

2. **Implement Custom Hooks**
   ```typescript
   // frontend/src/hooks/useApiData.ts
   // frontend/src/hooks/useForm.ts
   // frontend/src/hooks/useAuth.ts
   ```

3. **Create Utility Components**
   ```typescript
   // frontend/src/components/common/LoadingSpinner.tsx
   // frontend/src/components/common/ErrorMessage.tsx
   // frontend/src/components/common/PageLayout.tsx
   ```

#### Week 2: Page Component Refactoring
1. **Implement Component Composition**
   ```typescript
   // frontend/src/components/grants/GrantsFilters.tsx
   // frontend/src/components/grants/GrantsList.tsx
   // frontend/src/components/grants/GrantCard.tsx
   // frontend/src/components/grants/Pagination.tsx
   ```

2. **Refactor Page Components**
   ```typescript
   // frontend/src/app/grants/page.tsx - new thin implementation
   // frontend/src/app/tasks/page.tsx - new thin implementation
   // frontend/src/app/projects/page.tsx - new thin implementation
   ```

3. **Test UI Equivalence**
   - Compare old vs new component behavior
   - Ensure same user interactions work
   - Validate SGE team workflows are preserved

### Phase 4: Integration and Migration (1 week)

#### Integration Testing
1. **End-to-end Testing**
   - Test complete user workflows
   - Validate Shadow Goose Entertainment use cases
   - Ensure grant success rate algorithms are preserved

2. **Performance Testing**
   - Compare old vs new performance metrics
   - Ensure <200ms response times maintained
   - Validate database query efficiency

#### Production Migration
1. **Gradual Migration**
   - Deploy new backend alongside old (feature flags)
   - Migrate frontend components one page at a time
   - Monitor metrics during migration

2. **Validation**
   - Ensure 99.9% uptime maintained
   - Validate all business metrics preserved
   - Confirm SGE team workflow continuity

---

## Benefits and Outcomes

### Immediate Benefits (Post-Implementation)

#### Code Reduction
- **90% reduction in duplicate code** across API endpoints
- **80% reduction in frontend component complexity**
- **70% reduction in scraper code duplication**

#### Maintainability Improvements
- **Single responsibility classes** - easy to understand and modify
- **Consistent error handling** throughout entire application
- **Easy unit testing** with dependency injection
- **Clear separation of concerns** - business logic isolated from HTTP/UI

#### Feature Development Acceleration
- **New grant sources** = single new scraper class (vs modifying 5+ files)
- **New API endpoints** = composing existing services (vs writing from scratch)
- **New UI components** = composing existing hooks and components

### Long-term Benefits

#### Scalability
- **Modular architecture** that scales with team size
- **Easy onboarding** for new developers
- **Flexible design** that adapts to changing requirements

#### Business Continuity
- **Preserved functionality** - all SGE workflows maintain 100% equivalence
- **Maintained performance** - 99.9% uptime and <200ms response times
- **Enhanced reliability** - proper error handling and testing

#### Growth Enablement
- **Easy feature addition** - new grant sources, UI components, APIs
- **Simple customization** - Victorian framework can be extended easily
- **Maintainable success** - 75% grant success rate algorithms preserved and enhanced

### Preserved NavImpact Success Factors

#### Business Logic Preservation
- All Shadow Goose Entertainment workflows unchanged
- Victorian Government framework integration maintained exactly
- UN SDG tracking algorithms preserved with better organization
- Grant matching algorithms enhanced but functionally equivalent

#### Performance Maintenance
- 99.9% uptime maintained through careful migration
- <200ms response times preserved with better database patterns
- Real-time analytics continue unchanged
- All OKR tracking functionality preserved

#### User Experience Consistency
- All UI workflows maintain exact same user experience
- Error messages become more consistent and helpful
- Loading states become more predictable
- No disruption to daily SGE team usage

---

## Risk Mitigation and Success Criteria

### Risk Mitigation Strategies

#### Functional Equivalence Assurance
1. **Comprehensive Testing**
   - Unit tests for all service methods
   - Integration tests for all API endpoints
   - End-to-end tests for all user workflows

2. **Side-by-side Comparison**
   - Run old and new implementations in parallel
   - Compare outputs at every level (API responses, UI behavior, database operations)
   - Validate business logic equivalence

3. **Gradual Migration**
   - Feature flags to control migration
   - Rollback capability at every phase
   - Monitor all metrics during migration

#### Business Continuity Protection
1. **Zero Downtime Migration**
   - Deploy new components alongside old
   - Switch traffic gradually with monitoring
   - Immediate rollback capability

2. **SGE Workflow Validation**
   - Test all daily SGE team workflows
   - Validate media project management features
   - Ensure grant application processes unchanged

### Success Criteria

#### Technical Success Metrics
- [ ] 90% reduction in duplicate code achieved
- [ ] All API endpoints return identical responses
- [ ] All UI components behave identically to originals
- [ ] All business logic tests pass
- [ ] Performance benchmarks maintained or improved

#### Business Success Metrics  
- [ ] 99.9% uptime maintained during migration
- [ ] <200ms API response times preserved
- [ ] SGE team reports no workflow disruption
- [ ] Grant scraping accuracy maintained (same grants found)
- [ ] All existing features continue to work exactly as before

#### Long-term Success Indicators
- [ ] New features can be added 3x faster than before
- [ ] Code review time reduced by 50%
- [ ] Bug fixes isolated to single components/services
- [ ] New developer onboarding time reduced by 60%
- [ ] Codebase maintainability score improved significantly

---

## Conclusion

This SOLID/DRY refactoring strategy transforms NavImpact V2 into a highly maintainable, scalable architecture while preserving every aspect of its current success. By using the "fresh start with reference" approach, we achieve the benefits of clean architecture without the risks of complex in-place refactoring.

The resulting system will:
- **Maintain all current functionality** with 100% equivalence
- **Reduce maintenance burden** through DRY principles
- **Enable rapid feature development** through SOLID architecture
- **Preserve business success** with careful migration strategy
- **Support future growth** with modular, testable design

**Key Principle**: "Enhanced Architecture, Preserved Success" - dramatically improve the codebase structure while maintaining every aspect of NavImpact's impressive business results.

**Next Step**: Review this comprehensive strategy and begin with Phase 1 when ready to transform NavImpact into an even more maintainable and scalable platform.