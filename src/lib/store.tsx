import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  NOTICES as DEFAULT_NOTICES,
  EVENTS as DEFAULT_EVENTS,
  FACULTY as DEFAULT_FACULTY,
  COURSES as DEFAULT_COURSES,
  LABORATORIES as DEFAULT_LABORATORIES,
  STATS as DEFAULT_STATS,
} from '../data/content';
import { db, isFirebaseConfigured } from './firebase';
import { useAuth } from './auth';

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
  addNotice: (item: NoticeItem) => Promise<void>;
  updateNotice: (index: number, item: NoticeItem) => Promise<void>;
  deleteNotice: (index: number) => Promise<void>;
  addEvent: (item: EventItem) => Promise<void>;
  updateEvent: (index: number, item: EventItem) => Promise<void>;
  deleteEvent: (index: number) => Promise<void>;
  addFaculty: (item: FacultyItem) => Promise<void>;
  updateFaculty: (index: number, item: FacultyItem) => Promise<void>;
  deleteFaculty: (index: number) => Promise<void>;
}

const ContentStoreContext = createContext<ContentStoreType | null>(null);

const defaults = {
  notices: DEFAULT_NOTICES.map((item, index) => ({ ...item, id: `notice-${index + 1}` })),
  events: DEFAULT_EVENTS.map((item, index) => ({ ...item, id: `event-${index + 1}` })),
  faculty: DEFAULT_FACULTY.map((item, index) => ({ ...item, id: `faculty-${index + 1}` })),
};

type RemoteCollection = 'notices' | 'events' | 'faculty';

const remoteCollection = (name: RemoteCollection) => collection(db, 'content', name, 'items');
const remoteDocument = (name: RemoteCollection, id: string) => doc(db, 'content', name, 'items', id);

async function seedCollection(name: RemoteCollection, items: object[]) {
  const snapshot = await getDocs(remoteCollection(name));
  if (!snapshot.empty) return;

  const batch = writeBatch(db);
  items.forEach((item) => {
    const id = (item as { id: string }).id;
    batch.set(remoteDocument(name, id), item);
  });
  await batch.commit();
}

export const ContentStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [notices, setNotices] = useState<NoticeItem[]>(defaults.notices);
  const [events, setEvents] = useState<EventItem[]>(defaults.events);
  const [faculty, setFaculty] = useState<FacultyItem[]>(defaults.faculty);
  const [courses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [laboratories] = useState<LabItem[]>(DEFAULT_LABORATORIES);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;

    const noticeUnsubscribe = onSnapshot(remoteCollection('notices'), (snapshot) => {
      setNotices(snapshot.empty ? defaults.notices : snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as NoticeItem)));
    }, (error) => console.error('Failed to load notices from Firestore.', error));
    const eventUnsubscribe = onSnapshot(remoteCollection('events'), (snapshot) => {
      setEvents(snapshot.empty ? defaults.events : snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as EventItem)));
    }, (error) => console.error('Failed to load events from Firestore.', error));
    const facultyUnsubscribe = onSnapshot(remoteCollection('faculty'), (snapshot) => {
      setFaculty(snapshot.empty ? defaults.faculty : snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as FacultyItem)));
    }, (error) => console.error('Failed to load faculty from Firestore.', error));

    return () => {
      noticeUnsubscribe();
      eventUnsubscribe();
      facultyUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !isAdmin) return;
    void Promise.all([
      seedCollection('notices', defaults.notices),
      seedCollection('events', defaults.events),
      seedCollection('faculty', defaults.faculty),
    ]).catch((error) => console.error('Failed to initialize Firestore content.', error));
  }, [isAdmin]);

  const addItem = async (name: RemoteCollection, item: object) => {
    await addDoc(remoteCollection(name), item);
  };

  const updateItem = async (name: RemoteCollection, item: { id?: string }) => {
    if (!item.id) throw new Error('Cannot update a content item without an id.');
    const { id, ...data } = item;
    await setDoc(remoteDocument(name, id), data, { merge: true });
  };

  const deleteItem = async (name: RemoteCollection, item: { id?: string }) => {
    if (!item.id) throw new Error('Cannot delete a content item without an id.');
    await deleteDoc(remoteDocument(name, item.id));
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
        addNotice: (item) => addItem('notices', item),
        updateNotice: (_index, item) => updateItem('notices', item),
        deleteNotice: (index) => deleteItem('notices', notices[index]),
        addEvent: (item) => addItem('events', item),
        updateEvent: (_index, item) => updateItem('events', item),
        deleteEvent: (index) => deleteItem('events', events[index]),
        addFaculty: (item) => addItem('faculty', item),
        updateFaculty: (_index, item) => updateItem('faculty', item),
        deleteFaculty: (index) => deleteItem('faculty', faculty[index]),
      }}
    >
      {children}
    </ContentStoreContext.Provider>
  );
};

export const useContentStore = () => {
  const context = useContext(ContentStoreContext);
  if (!context) throw new Error('useContentStore must be used within a ContentStoreProvider');
  return context;
};
