# Mock Data Archive

This folder contains mock data files that were used for testing and development but are no longer needed since the system now uses real data.

## Files Moved Here:

### `mock_api.py`
- **Purpose**: Mock API server for SGE presentation
- **Status**: Replaced by real API endpoints
- **Date Moved**: When transitioning to real data

### `render_mock_api.py`
- **Purpose**: Mock API for Render deployment testing
- **Status**: Replaced by real API endpoints
- **Date Moved**: When transitioning to real data

## Why These Were Moved:

1. **Real Data Integration**: The system now uses real Google Analytics, Instagram, Notion, and Grant APIs
2. **Production Ready**: No longer need mock data for testing
3. **Clean Codebase**: Removing unused files to maintain clarity
4. **Safety**: Keeping backups in case needed for reference

## Current Status:

- ✅ **Real Data**: Google Analytics, Instagram, Notion, Grants
- ✅ **Production**: All endpoints using live data
- ✅ **Clean**: Mock data safely archived

## If You Need These Files:

If you need to reference the mock data structure, you can find it here. However, the current system uses real data from:

- **Google Analytics**: G-W5J0946RGP (Shadow Goose website)
- **Instagram**: Real social media metrics
- **Notion**: Live project management data
- **Grants**: Real grant opportunities from various sources

## Restoration (if needed):

```bash
# To restore mock files (not recommended for production)
cp ARCHIVE/mock_data/mock_api.py ./
cp ARCHIVE/mock_data/render_mock_api.py ./
```

**Note**: Only restore if you specifically need mock data for development/testing purposes. 