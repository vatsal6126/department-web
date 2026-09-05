import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  NOTICES as DEFAULT_NOTICES,
  EVENTS as DEFAULT_EVENTS,
  FACULTY as DEFAULT_FACULTY,
  COURSES as DEFAULT_COURSES,
  LABORATORIES as DEFAULT_LABORATORIES,
  STATS as DEFAULT_STATS,
} from '../data/content';

export interface NoticeItem {
  id?: string;
  category: string;
  date: string;
  title: string;
  description: string;
  isUrgent?: boolean;
  downloadUrl?: string;
}

export interface EventItem {
  id?: string;
  tag: string;
  status: 'Upcoming' | 'Completed' | string;
  date: string;
  venue: string;
  title: string;
  description: string;
}

export interface FacultyItem {
  id?: string;
  name: string;
  role: string;
  email: string;
  image: string;
  qualification: string;
  specialization: string;
  office: string;
  experience: string;
}

export interface CourseItem {
  tag: string;
  altTag?: boolean;
  title: string;
  duration: string;
  intake: string;
  gtuSchemeUrl: string;
  description: string;
  keySubjects?: string[];
}

export interface LabItem {
  name: string;
  desc: string;
}

interface ContentStoreType {
  notices: NoticeItem[];
  events: EventItem[];
  faculty: FacultyItem[];
  courses: CourseItem[];
  laboratories: LabItem[];
  stats: typeof DEFAULT_STATS;
  addNotice: (item: NoticeItem) => void;
  updateNotice: (index: number, item: NoticeItem) => void;
  deleteNotice: (index: number) => void;
  addEvent: (item: EventItem) => void;
  updateEvent: (index: number, item: EventItem) => void;
  deleteEvent: (index: number) => void;
  addFaculty: (item: FacultyItem) => void;
  updateFaculty: (index: number, item: FacultyItem) => void;
  deleteFaculty: (index: number) => void;
  resetToDefaults: () => void;
}

const ContentStoreContext = createContext<ContentStoreType | null>(null);

const STORAGE_KEYS = {
  NOTICES: 'ldce_store_notices',
  EVENTS: 'ldce_store_events',
  FACULTY: 'ldce_store_faculty',
  COURSES: 'ldce_store_courses',
  LABS: 'ldce_store_labs',
};

export const ContentStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      return saved ? JSON.parse(saved) : DEFAULT_NOTICES;
    } catch {
      return DEFAULT_NOTICES;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });

  const [faculty, setFaculty] = useState<FacultyItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FACULTY);
      return saved ? JSON.parse(saved) : DEFAULT_FACULTY;
    } catch {
      return DEFAULT_FACULTY;
    }
  });

  const [courses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [laboratories] = useState<LabItem[]>(DEFAULT_LABORATORIES);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  }, [faculty]);

  const addNotice = (item: NoticeItem) => {
    setNotices((prev) => [item, ...prev]);
  };

  const deleteNotice = (index: number) => {
    setNotices((prev) => prev.filter((_, i) => i !== index));
  };
  const updateNotice = (index: number, item: NoticeItem) => {
    setNotices((prev) => prev.map((notice, i) => (i === index ? item : notice)));
  };

  const addEvent = (item: EventItem) => {
    setEvents((prev) => [item, ...prev]);
  };

  const deleteEvent = (index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };
  const updateEvent = (index: number, item: EventItem) => {
    setEvents((prev) => prev.map((event, i) => (i === index ? item : event)));
  };

  const addFaculty = (item: FacultyItem) => {
    setFaculty((prev) => [...prev, item]);
  };

  const deleteFaculty = (index: number) => {
    setFaculty((prev) => prev.filter((_, i) => i !== index));
  };
  const updateFaculty = (index: number, item: FacultyItem) => {
    setFaculty((prev) => prev.map((member, i) => (i === index ? item : member)));
  };

  const resetToDefaults = () => {
    setNotices(DEFAULT_NOTICES);
    setEvents(DEFAULT_EVENTS);
    setFaculty(DEFAULT_FACULTY);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.FACULTY);
  };

  return (
    <ContentStoreContext.Provider
      value={{
        notices,
        events,
        faculty,
        courses,
        laboratories,
        stats: DEFAULT_STATS,
        addNotice,
        updateNotice,
        deleteNotice,
        addEvent,
        updateEvent,
        deleteEvent,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        resetToDefaults,
      }}
    >
      {children}
    </ContentStoreContext.Provider>
  );
};

export const useContentStore = () => {
  const context = useContext(ContentStoreContext);
  if (!context) {
    throw new Error('useContentStore must be used within a ContentStoreProvider');
  }
  return context;
};
