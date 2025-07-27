"""
Notion API Client Service
Robust client for interacting with Notion API with retry logic and error handling
"""

import asyncio
import time
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from urllib.parse import urlencode
import httpx
from app.core.api_client import APIClient, APIResponse, RetryConfig
from app.core.config import settings

logger = logging.getLogger(__name__)


class NotionAPIError(Exception):
    """Custom exception for Notion API errors."""
    
    def __init__(self, message: str, status_code: int = None, response_data: Dict = None):
        self.message = message
        self.status_code = status_code
        self.response_data = response_data
        super().__init__(self.message)


class NotionAPIClient:
    """Robust Notion API client with retry logic and error handling."""
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = "https://api.notion.com/v1"
        
        # Configure retry for Notion API (conservative)
        retry_config = RetryConfig(
            max_retries=3,
            initial_delay=1.0,
            max_delay=30.0,
            backoff_factor=2.0,
            jitter=True
        )
        
        # Create API client with Notion-specific headers
        self.client = APIClient(
            base_url=self.base_url,
            retry_config=retry_config,
            timeout=30.0,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json"
            }
        )
    
    def _handle_response(self, response: APIResponse) -> Dict[str, Any]:
        """Handle API response and raise appropriate errors."""
        if not response.success:
            error_msg = f"Notion API error: {response.status_code}"
            if response.data and "message" in response.data:
                error_msg += f" - {response.data['message']}"
            
            raise NotionAPIError(
                message=error_msg,
                status_code=response.status_code,
                response_data=response.data
            )
        
        return response.data or {}
    
    def get_workspace_info(self) -> Dict[str, Any]:
        """Get workspace information."""
        response = self.client.get("/users/me")
        return self._handle_response(response)
    
    def get_page(self, page_id: str) -> Dict[str, Any]:
        """Get a page by ID."""
        response = self.client.get(f"/pages/{page_id}")
        return self._handle_response(response)
    
    def create_page(self, parent_id: str, properties: Dict[str, Any], content: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """Create a new page."""
        data = {
            "parent": {"page_id": parent_id},
            "properties": properties
        }
        
        if content:
            data["children"] = content
        
        response = self.client.post("/pages", data=data)
        return self._handle_response(response)
    
    def update_page(self, page_id: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        """Update a page."""
        data = {"properties": properties}
        response = self.client.patch(f"/pages/{page_id}", data=data)
        return self._handle_response(response)
    
    def delete_page(self, page_id: str) -> Dict[str, Any]:
        """Delete a page (archive it)."""
        data = {"archived": True}
        response = self.client.patch(f"/pages/{page_id}", data=data)
        return self._handle_response(response)
    
    def get_database(self, database_id: str) -> Dict[str, Any]:
        """Get a database by ID."""
        response = self.client.get(f"/databases/{database_id}")
        return self._handle_response(response)
    
    def query_database(self, database_id: str, filters: Optional[Dict] = None, sorts: Optional[List[Dict]] = None, page_size: int = 100) -> Dict[str, Any]:
        """Query a database."""
        data = {"page_size": page_size}
        
        if filters:
            data["filter"] = filters
        
        if sorts:
            data["sorts"] = sorts
        
        response = self.client.post(f"/databases/{database_id}/query", data=data)
        return self._handle_response(response)
    
    def create_database(self, parent_id: str, title: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new database."""
        data = {
            "parent": {"page_id": parent_id},
            "title": [{"text": {"content": title}}],
            "properties": properties
        }
        
        response = self.client.post("/databases", data=data)
        return self._handle_response(response)
    
    def add_block(self, block_id: str, children: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Add blocks to a page."""
        data = {"children": children}
        response = self.client.patch(f"/blocks/{block_id}/children", data=data)
        return self._handle_response(response)
    
    def get_block_children(self, block_id: str, page_size: int = 100) -> Dict[str, Any]:
        """Get children of a block."""
        params = {"page_size": page_size}
        response = self.client.get(f"/blocks/{block_id}/children", params=params)
        return self._handle_response(response)
    
    def search(self, query: str = "", filter_type: str = "page", page_size: int = 100) -> Dict[str, Any]:
        """Search for pages or databases."""
        data = {
            "query": query,
            "filter": {"property": "object", "value": filter_type},
            "page_size": page_size
        }
        
        response = self.client.post("/search", data=data)
        return self._handle_response(response)


class NotionTemplateManager:
    """Manager for Notion templates and content generation."""
    
    def __init__(self, client: NotionAPIClient):
        self.client = client
    
    def create_media_project_template(self, parent_page_id: str, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a media project template page."""
        
        # Define page properties
        properties = {
            "Title": {
                "title": [
                    {
                        "text": {
                            "content": project_data.get("title", "New Media Project")
                        }
                    }
                ]
            },
            "Status": {
                "select": {
                    "name": project_data.get("status", "Planning")
                }
            },
            "Project Type": {
                "select": {
                    "name": project_data.get("project_type", "Video")
                }
            },
            "Start Date": {
                "date": {
                    "start": project_data.get("start_date")
                }
            },
            "End Date": {
                "date": {
                    "start": project_data.get("end_date")
                }
            },
            "Budget": {
                "number": project_data.get("budget", 0)
            },
            "Target Audience": {
                "number": project_data.get("target_audience", 0)
            },
            "Team Members": {
                "multi_select": [
                    {"name": member} for member in project_data.get("team_members", [])
                ]
            },
            "Distribution Channels": {
                "multi_select": [
                    {"name": channel} for channel in project_data.get("distribution_channels", [])
                ]
            }
        }
        
        # Define page content
        content = [
            {
                "object": "block",
                "type": "heading_1",
                "heading_1": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": "Project Overview"
                            }
                        }
                    ]
                }
            },
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": project_data.get("description", "Project description will be added here.")
                            }
                        }
                    ]
                }
            },
            {
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": "Distribution Log"
                            }
                        }
                    ]
                }
            },
            {
                "object": "block",
                "type": "table_of_contents",
                "table_of_contents": {}
            },
            {
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": "Performance Metrics"
                            }
                        }
                    ]
                }
            },
            {
                "object": "block",
                "type": "callout",
                "callout": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": "Performance metrics will be automatically synced from NavImpact."
                            }
                        }
                    ],
                    "icon": {
                        "type": "emoji",
                        "emoji": "📊"
                    },
                    "color": "blue_background"
                }
            }
        ]
        
        return self.client.create_page(parent_page_id, properties, content)
    
    def create_distribution_log_template(self, parent_page_id: str, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a distribution log template."""
        
        properties = {
            "Activity": {
                "title": [
                    {
                        "text": {
                            "content": log_data.get("activity_type", "Distribution Activity")
                        }
                    }
                ]
            },
            "Channel": {
                "select": {
                    "name": log_data.get("channel", "Social Media")
                }
            },
            "Date": {
                "date": {
                    "start": log_data.get("date")
                }
            },
            "Reach": {
                "number": log_data.get("reach", 0)
            },
            "Engagement": {
                "number": log_data.get("engagement", 0)
            },
            "Conversions": {
                "number": log_data.get("conversions", 0)
            }
        }
        
        content = [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": log_data.get("notes", "Distribution activity notes.")
                            }
                        }
                    ]
                }
            }
        ]
        
        return self.client.create_page(parent_page_id, properties, content)


class NotionSyncManager:
    """Manager for syncing data between NavImpact and Notion."""
    
    def __init__(self, client: NotionAPIClient, template_manager: NotionTemplateManager):
        self.client = client
        self.template_manager = template_manager
    
    def sync_media_project(self, project_data: Dict[str, Any], notion_page_id: str) -> Dict[str, Any]:
        """Sync a media project to Notion."""
        try:
            # Update the existing page with new project data
            properties = self._map_project_to_notion_properties(project_data)
            result = self.client.update_page(notion_page_id, properties)
            
            logger.info(f"Successfully synced project {project_data.get('id')} to Notion page {notion_page_id}")
            return result
            
        except NotionAPIError as e:
            logger.error(f"Failed to sync project {project_data.get('id')} to Notion: {e.message}")
            raise
    
    def _map_project_to_notion_properties(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Map NavImpact project data to Notion properties."""
        return {
            "Title": {
                "title": [
                    {
                        "text": {
                            "content": project_data.get("title", "")
                        }
                    }
                ]
            },
            "Status": {
                "select": {
                    "name": project_data.get("status", "Active")
                }
            },
            "Project Type": {
                "select": {
                    "name": project_data.get("project_type", "Video")
                }
            },
            "Start Date": {
                "date": {
                    "start": project_data.get("start_date")
                }
            },
            "End Date": {
                "date": {
                    "start": project_data.get("end_date")
                }
            },
            "Budget": {
                "number": project_data.get("budget", 0)
            },
            "Target Audience": {
                "number": project_data.get("target_audience", 0)
            },
            "Impact Score": {
                "number": project_data.get("impact_score", 0)
            }
        }
    
    def sync_distribution_log(self, log_data: Dict[str, Any], notion_page_id: str) -> Dict[str, Any]:
        """Sync a distribution log to Notion."""
        try:
            properties = self._map_distribution_to_notion_properties(log_data)
            result = self.client.update_page(notion_page_id, properties)
            
            logger.info(f"Successfully synced distribution log {log_data.get('id')} to Notion")
            return result
            
        except NotionAPIError as e:
            logger.error(f"Failed to sync distribution log {log_data.get('id')} to Notion: {e.message}")
            raise
    
    def _map_distribution_to_notion_properties(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Map distribution log data to Notion properties."""
        return {
            "Activity": {
                "title": [
                    {
                        "text": {
                            "content": log_data.get("activity_type", "")
                        }
                    }
                ]
            },
            "Channel": {
                "select": {
                    "name": log_data.get("channel", "")
                }
            },
            "Date": {
                "date": {
                    "start": log_data.get("date")
                }
            },
            "Reach": {
                "number": log_data.get("reach", 0)
            },
            "Engagement": {
                "number": log_data.get("engagement", 0)
            },
            "Conversions": {
                "number": log_data.get("conversions", 0)
            }
        } 