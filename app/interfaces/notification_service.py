from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class NotificationServiceInterface(ABC):
    """
    Notification service interface following Dependency Inversion Principle.
    Allows business logic to depend on abstractions, not concrete implementations.
    """

    @abstractmethod
    def send_notification(
        self, user_id: int, message: str, notification_type: str = "info"
    ) -> bool:
        """
        Send notification to a user

        Args:
            user_id: ID of the user to notify
            message: Notification message
            notification_type: Type of notification (info, warning, success, error)

        Returns:
            bool: True if notification sent successfully
        """
        pass

    @abstractmethod
    def send_grant_notification(
        self, user_id: int, grant_id: int, notification_type: str
    ) -> bool:
        """
        Send grant-specific notification

        Args:
            user_id: ID of the user to notify
            grant_id: ID of the grant
            notification_type: Type of notification (new_match, deadline_reminder, etc.)

        Returns:
            bool: True if notification sent successfully
        """
        pass

    @abstractmethod
    def send_bulk_notification(
        self, user_ids: list[int], message: str, notification_type: str = "info"
    ) -> Dict[int, bool]:
        """
        Send notification to multiple users

        Args:
            user_ids: List of user IDs to notify
            message: Notification message
            notification_type: Type of notification

        Returns:
            Dict[int, bool]: Mapping of user_id to success status
        """
        pass

    @abstractmethod
    def get_user_notifications(
        self, user_id: int, limit: int = 50
    ) -> list[Dict[str, Any]]:
        """
        Get notifications for a user

        Args:
            user_id: ID of the user
            limit: Maximum number of notifications to return

        Returns:
            List of notification dictionaries
        """
        pass

    @abstractmethod
    def mark_notification_read(self, notification_id: int, user_id: int) -> bool:
        """
        Mark a notification as read

        Args:
            notification_id: ID of the notification
            user_id: ID of the user

        Returns:
            bool: True if marked successfully
        """
        pass
