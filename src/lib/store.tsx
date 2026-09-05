import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  EVENTS as DEFAULT_EVENTS,
  FACULTY as DEFAULT_FACULTY,
  COURSES as DEFAULT_COURSES,
  LABORATORIES as DEFAULT_LABORATORIES,
  NOTICES as DEFAULT_NOTICES,
  STATS as DEFAULT_STATS,
} from '../data/content';
import { isSupabaseConfigured, supabase } from './supabase';
import { useAuth } from './auth';

export interface NoticeItem { id?: string; category: string; date: string; title: string; description: string; isUrgent?: boolean; downloadUrl?: string; }
export interface EventItem { id?: string; tag: string; status: 'Upcoming' | 'Completed' | string; date: string; venue: string; title: string; description: string; }
export interface FacultyItem { id?: string; name: string; role: string; email: string; image: string; qualification: string; specialization: string; office: string; experience: string; }
export interface CourseItem { tag: string; altTag?: boolean; title: string; duration: string; intake: string; gtuSchemeUrl: string; description: string; keySubjects?: string[]; }
export interface LabItem { name: string; desc: string; }

interface ContentStoreType {
  notices: NoticeItem[]; events: EventItem[]; faculty: FacultyItem[]; courses: CourseItem[]; laboratories: LabItem[]; stats: typeof DEFAULT_STATS;
  addNotice: (item: NoticeItem) => Promise<void>; updateNotice: (index: number, item: NoticeItem) => Promise<void>; deleteNotice: (index: number) => Promise<void>;
  addEvent: (item: EventItem) => Promise<void>; updateEvent: (index: number, item: EventItem) => Promise<void>; deleteEvent: (index: number) => Promise<void>;
  addFaculty: (item: FacultyItem) => Promise<void>; updateFaculty: (index: number, item: FacultyItem) => Promise<void>; deleteFaculty: (index: number) => Promise<void>;
}

const ContentStoreContext = createContext<ContentStoreType | null>(null);
const defaults = {
  notices: DEFAULT_NOTICES.map((item, index) => ({ ...item, id: `notice-${index + 1}` })),
  events: DEFAULT_EVENTS.map((item, index) => ({ ...item, id: `event-${index + 1}` })),
  faculty: DEFAULT_FACULTY.map((item, index) => ({ ...item, id: `faculty-${index + 1}` })),
};
type CollectionName = 'notices' | 'events' | 'faculty';

async function readCollection<T>(name: CollectionName, fallback: T[]) {
  const { data, error } = await supabase.from('content_items').select('id, data').eq('collection', name).order('created_at');
  if (error) throw error;
  return data?.length ? data.map((row) => ({ id: row.id, ...(row.data as object) })) as T[] : fallback;
}

async function seedCollection(name: CollectionName, items: object[]) {
  const { count, error } = await supabase.from('content_items').select('id', { count: 'exact', head: true }).eq('collection', name);
  if (error) throw error;
  if (count) return;
  const { error: insertError } = await supabase.from('content_items').insert(items.map(({ id, ...data }) => ({ id, collection: name, data })));
  if (insertError) throw insertError;
}

export const ContentStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [notices, setNotices] = useState<NoticeItem[]>(defaults.notices);
  const [events, setEvents] = useState<EventItem[]>(defaults.events);
  const [faculty, setFaculty] = useState<FacultyItem[]>(defaults.faculty);
  const [courses] = useState(DEFAULT_COURSES);
  const [laboratories] = useState(DEFAULT_LABORATORIES);

  const reload = async () => {
    if (!isSupabaseConfigured) return;
    const [nextNotices, nextEvents, nextFaculty] = await Promise.all([
      readCollection<NoticeItem>('notices', defaults.notices),
      readCollection<EventItem>('events', defaults.events),
      readCollection<FacultyItem>('faculty', defaults.faculty),
    ]);
    setNotices(nextNotices); setEvents(nextEvents); setFaculty(nextFaculty);
  };

  useEffect(() => {
    void reload().catch((error) => console.error('Failed to load Supabase content.', error));
    if (!isSupabaseConfigured) return undefined;
    const channel = supabase.channel('content-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_items' }, () => {
        void reload().catch((error) => console.error('Failed to refresh Supabase content.', error));
      }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !isAdmin) return;
    void Promise.all([
      seedCollection('notices', defaults.notices),
      seedCollection('events', defaults.events),
      seedCollection('faculty', defaults.faculty),
    ]).then(reload).catch((error) => console.error('Failed to initialize Supabase content.', error));
  }, [isAdmin]);

  const addItem = async (collection: CollectionName, item: object) => {
    const { id, ...data } = item as { id?: string };
    const { error } = await supabase.from('content_items').insert({ ...(id ? { id } : {}), collection, data });
    if (error) throw error;
  };
  const updateItem = async (item: { id?: string }, collection: CollectionName) => {
    if (!item.id) throw new Error('Cannot update a content item without an id.');
    const { id, ...data } = item;
    const { error } = await supabase.from('content_items').update({ data }).eq('id', id).eq('collection', collection);
    if (error) throw error;
  };
  const deleteItem = async (item: { id?: string }, collection: CollectionName) => {
    if (!item.id) throw new Error('Cannot delete a content item without an id.');
    const { error } = await supabase.from('content_items').delete().eq('id', item.id).eq('collection', collection);
    if (error) throw error;
  };

  return <ContentStoreContext.Provider value={{
    notices, events, faculty, courses, laboratories, stats: DEFAULT_STATS,
    addNotice: (item) => addItem('notices', item), updateNotice: (_, item) => updateItem(item, 'notices'), deleteNotice: (i) => deleteItem(notices[i], 'notices'),
    addEvent: (item) => addItem('events', item), updateEvent: (_, item) => updateItem(item, 'events'), deleteEvent: (i) => deleteItem(events[i], 'events'),
    addFaculty: (item) => addItem('faculty', item), updateFaculty: (_, item) => updateItem(item, 'faculty'), deleteFaculty: (i) => deleteItem(faculty[i], 'faculty'),
  }}>{children}</ContentStoreContext.Provider>;
};

export const useContentStore = () => {
  const context = useContext(ContentStoreContext);
  if (!context) throw new Error('useContentStore must be used within a ContentStoreProvider');
  return context;
};
