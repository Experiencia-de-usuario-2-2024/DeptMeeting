export enum RabbitMQ {
    UserQueue = 'users',
    GuestQueue = 'guests',
    ProjectQueue = 'projects',
    MeetingQueue = 'meetings',
    PreMeetingQueue = 'pre-meetings',
    InMeetingQueue = 'in-meetings',
    PostMeetingQueue = 'post-meetings',
    MeetingMinuteQueue = 'meeting-minutes',
    ElementQueue = 'elements',
    TaskQueue = 'tasks',
    ReminderQueue = 'reminders',
    KanbanQueue = 'kanban',
    NotificationQueue = 'notifications',
    JavaTestQueue = 'java-test',
    TextEditor = 'text-editor',
    Doodle = 'doodle',
    CollaborativeChat = 'collaborative-chat',
    KanbanPlus = 'kanban-plus',
    MetricsQueue = 'metrics',
  }

export enum ProjectMetricsMSG {
    FIND_ASSISTS_BY_ID = 'FIND_ASSISTS_BY_ID',
}