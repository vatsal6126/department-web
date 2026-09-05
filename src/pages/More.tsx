import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Users,
  Upload,
  Trash2,
  Plus,
  CheckCircle,
  Pencil,
  LogOut,
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { useContentStore } from '../lib/store';
import { uploadFileToStorage } from '../lib/fileUpload';
import { useRouter } from '../lib/router';

type Tab = 'notices' | 'events' | 'faculty';

export const More: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('notices');
  const store = useContentStore();
  const { navigate } = useRouter();
  const [editingNoticeIndex, setEditingNoticeIndex] = useState<number | null>(null);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);
  const [editingFacultyIndex, setEditingFacultyIndex] = useState<number | null>(null);

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('Circulars');
  const [noticeCustomCategory, setNoticeCustomCategory] = useState('');
  const [noticeDate, setNoticeDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );
  const [noticeUrgent, setNoticeUrgent] = useState(false);
  const [noticePdfUrl, setNoticePdfUrl] = useState('');
  const [uploadingNoticeFile, setUploadingNoticeFile] = useState(false);

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventTag, setEventTag] = useState('Workshop');
  const [eventCustomTag, setEventCustomTag] = useState('');
  const [eventStatus, setEventStatus] = useState('Upcoming');
  const [eventCustomStatus, setEventCustomStatus] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('Department Seminar Hall (Block 2)');

  // Faculty Form State
  const [facultyName, setFacultyName] = useState('');
  const [facultyRole, setFacultyRole] = useState('Assistant Professor');
  const [facultyCustomRole, setFacultyCustomRole] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyQual, setFacultyQual] = useState('');
  const [facultySpec, setFacultySpec] = useState('');
  const [facultyOffice, setFacultyOffice] = useState('Block 2, Room ');
  const [facultyExp, setFacultyExp] = useState('5+ Years');
  const [facultyImgUrl, setFacultyImgUrl] = useState('');
  const [uploadingFacultyImg, setUploadingFacultyImg] = useState(false);

  // Notice Handlers
  const handleNoticeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNoticeFile(true);
    try {
      const result = await uploadFileToStorage(file);
      setNoticePdfUrl(result.url);
    } catch (err) {
      console.error(err);
      alert('File upload failed. Please try again.');
    } finally {
      setUploadingNoticeFile(false);
    }
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeDesc.trim()) return;

    const item = {
      title: noticeTitle.trim(),
      description: noticeDesc.trim(),
      category: noticeCategory === 'Other' ? noticeCustomCategory.trim() || 'Other' : noticeCategory,
      date: noticeDate,
      isUrgent: noticeUrgent,
      downloadUrl: noticePdfUrl || '#/notices',
    };
    if (editingNoticeIndex === null) store.addNotice(item);
    else store.updateNotice(editingNoticeIndex, { ...item, id: store.notices[editingNoticeIndex].id });

    setNoticeTitle('');
    setNoticeDesc('');
    setNoticePdfUrl('');
    setNoticeUrgent(false);
    setNoticeCustomCategory('');
    setEditingNoticeIndex(null);
    alert('Notice published successfully! It is now live on the Notice Board.');
  };

  // Event Handlers
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDesc.trim() || !eventDate.trim()) return;

    const item = {
      title: eventTitle.trim(),
      description: eventDesc.trim(),
      tag: eventTag === 'Other' ? eventCustomTag.trim() || 'Other' : eventTag,
      status: eventStatus === 'Other' ? eventCustomStatus.trim() || 'Other' : eventStatus,
      date: eventDate.trim(),
      venue: eventVenue.trim(),
    };
    if (editingEventIndex === null) store.addEvent(item);
    else store.updateEvent(editingEventIndex, { ...item, id: store.events[editingEventIndex].id });

    setEventTitle('');
    setEventDesc('');
    setEventDate('');
    setEventCustomTag('');
    setEventCustomStatus('');
    setEditingEventIndex(null);
    alert('Event added successfully! It is now live on the Events page.');
  };

  // Faculty Handlers
  const handleFacultyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFacultyImg(true);
    try {
      const result = await uploadFileToStorage(file);
      setFacultyImgUrl(result.url);
    } catch (err) {
      console.error(err);
      alert('Image upload failed.');
    } finally {
      setUploadingFacultyImg(false);
    }
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim() || !facultyEmail.trim()) return;

    const item = {
      name: facultyName.trim(),
      role: facultyRole === 'Other' ? facultyCustomRole.trim() || 'Other' : facultyRole,
      email: facultyEmail.trim(),
      qualification: facultyQual.trim() || 'M.E. Chemical Engineering',
      specialization: facultySpec.trim() || 'Process Engineering',
      office: facultyOffice.trim() || 'Block 2',
      experience: facultyExp.trim() || '5+ Years',
      image: facultyImgUrl || 'images/faculty1.png',
    };
    if (editingFacultyIndex === null) store.addFaculty(item);
    else store.updateFaculty(editingFacultyIndex, { ...item, id: store.faculty[editingFacultyIndex].id });

    setFacultyName('');
    setFacultyEmail('');
    setFacultyQual('');
    setFacultySpec('');
    setFacultyImgUrl('');
    setFacultyCustomRole('');
    setEditingFacultyIndex(null);
    alert('Faculty profile added successfully! It is now live on the Department directory.');
  };

  const handleLogout = () => {
    navigate('/admin-login');
  };

  const editNotice = (index: number) => {
    const item = store.notices[index];
    setEditingNoticeIndex(index);
    setNoticeTitle(item.title);
    setNoticeDesc(item.description);
    setNoticeCategory(['Exams', 'Submissions', 'Circulars', 'Other'].includes(item.category) ? item.category : 'Other');
    setNoticeCustomCategory(['Exams', 'Submissions', 'Circulars'].includes(item.category) ? '' : item.category);
    setNoticeDate(item.date);
    setNoticeUrgent(Boolean(item.isUrgent));
    setNoticePdfUrl(item.downloadUrl?.startsWith('data:') || item.downloadUrl?.startsWith('http') ? item.downloadUrl : '');
    setActiveTab('notices');
  };

  const editEvent = (index: number) => {
    const item = store.events[index];
    setEditingEventIndex(index);
    setEventTitle(item.title);
    setEventDesc(item.description);
    setEventTag(['Workshop', 'Industrial Tour', 'Expert Talk', 'Symposium', 'Webinar', 'Other'].includes(item.tag) ? item.tag : 'Other');
    setEventCustomTag(['Workshop', 'Industrial Tour', 'Expert Talk', 'Symposium', 'Webinar'].includes(item.tag) ? '' : item.tag);
    setEventStatus(['Upcoming', 'Completed', 'Other'].includes(item.status) ? item.status : 'Other');
    setEventCustomStatus(['Upcoming', 'Completed'].includes(item.status) ? '' : item.status);
    setEventDate(item.date);
    setEventVenue(item.venue);
    setActiveTab('events');
  };

  const editFaculty = (index: number) => {
    const item = store.faculty[index];
    setEditingFacultyIndex(index);
    setFacultyName(item.name);
    setFacultyRole(['Head of Department & Professor', 'Professor', 'Associate Professor', 'Assistant Professor', 'Other'].includes(item.role) ? item.role : 'Other');
    setFacultyCustomRole(['Head of Department & Professor', 'Professor', 'Associate Professor', 'Assistant Professor'].includes(item.role) ? '' : item.role);
    setFacultyEmail(item.email);
    setFacultyQual(item.qualification);
    setFacultySpec(item.specialization);
    setFacultyOffice(item.office);
    setFacultyExp(item.experience);
    setFacultyImgUrl(item.image);
    setActiveTab('faculty');
  };

  return (
    <main className="page-container admin-cms-container">
      <SectionHeader
        badge="Administration & CMS"
        title="Department Content Manager"
        subtitle="Manage live circulars, faculty roster, and event announcements."
      />
      <div className="admin-toolbar">
        <span>Signed in as administrator</span>
        <button type="button" className="btn btn-outline" onClick={handleLogout}><LogOut size={14} /> Sign out</button>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
          onClick={() => setActiveTab('notices')}
        >
          <Bell size={15} /> Notices & Circulars
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={15} /> Department Events
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
          onClick={() => setActiveTab('faculty')}
        >
          <Users size={15} /> Faculty Directory
        </button>
      </div>

      {/* TAB 1: NOTICES MANAGER */}
      {activeTab === 'notices' && (
        <Reveal>
          <div className="admin-grid-layout">
            <div className="content-card admin-form-card">
              <h3>
                <Plus size={18} className="inline-icon" /> Publish New Notice / Circular
              </h3>
              <form onSubmit={handleCreateNotice} className="admin-form">
                <div className="form-group">
                  <label>Notice Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Remedial Exam Timetable Announced"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={noticeCategory}
                      onChange={(e) => setNoticeCategory(e.target.value)}
                      className="admin-input"
                    >
                      <option value="Exams">Exams</option>
                      <option value="Submissions">Submissions</option>
                      <option value="Circulars">Circulars</option>
                      <option value="Other">Other</option>
                    </select>
                    {noticeCategory === 'Other' && <input className="admin-input" placeholder="Enter category" value={noticeCustomCategory} onChange={(e) => setNoticeCustomCategory(e.target.value)} required />}
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="text"
                      value={noticeDate}
                      onChange={(e) => setNoticeDate(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description / Notice Details *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide full instructions or bulletin note for students..."
                    value={noticeDesc}
                    onChange={(e) => setNoticeDesc(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label>Attach PDF Circular</label>
                  <div className="file-upload-box">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={handleNoticeFileUpload}
                      disabled={uploadingNoticeFile}
                      id="notice-file-input"
                    />
                    <label htmlFor="notice-file-input" className="file-upload-label">
                      <Upload size={16} />{' '}
                      {uploadingNoticeFile ? 'Uploading file...' : noticePdfUrl ? 'PDF Attached ✓' : 'Choose PDF Circular'}
                    </label>
                  </div>
                  {noticePdfUrl && (
                    <span className="file-ready-text">
                      <CheckCircle size={13} color="green" /> File attached ready to download
                    </span>
                  )}
                </div>

                <div className="form-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={noticeUrgent}
                      onChange={(e) => setNoticeUrgent(e.target.checked)}
                    />{' '}
                    Mark as <strong>URGENT</strong> announcement
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  {editingNoticeIndex === null ? 'Publish Notice Live' : 'Save Notice Changes'}
                </button>
              </form>
            </div>

            {/* List of active notices */}
            <div className="content-card admin-list-card">
              <h3>Live Notice Board ({store.notices.length} items)</h3>
              <div className="admin-item-list">
                {store.notices.map((n, idx) => (
                  <div key={idx} className="admin-item-row">
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span className="badge-tag">{n.category}</span>
                        {n.isUrgent && <span className="badge-tag urgent">URGENT</span>}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</span>
                      </div>
                      <h4 style={{ margin: '0.3rem 0 0.1rem' }}>{n.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.description}</p>
                    </div>
                    <div className="admin-item-actions">
                      <button type="button" onClick={() => editNotice(idx)} className="edit-item-btn" title="Edit Notice"><Pencil size={15} /></button>
                      <button type="button" onClick={() => store.deleteNotice(idx)} className="delete-item-btn" title="Delete Notice"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* TAB 2: EVENTS MANAGER */}
      {activeTab === 'events' && (
        <Reveal>
          <div className="admin-grid-layout">
            <div className="content-card admin-form-card">
              <h3>
                <Plus size={18} className="inline-icon" /> Create New Department Event
              </h3>
              <form onSubmit={handleCreateEvent} className="admin-form">
                <div className="form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STTP on Aspen Plus Simulation"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Event Type</label>
                    <select value={eventTag} onChange={(e) => setEventTag(e.target.value)} className="admin-input">
                      <option value="Workshop">Workshop</option>
                      <option value="Industrial Tour">Industrial Tour</option>
                      <option value="Expert Talk">Expert Talk</option>
                      <option value="Symposium">Symposium</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Other">Other</option>
                    </select>
                    {eventTag === 'Other' && <input className="admin-input" placeholder="Enter event type" value={eventCustomTag} onChange={(e) => setEventCustomTag(e.target.value)} required />}
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={eventStatus}
                      onChange={(e) => setEventStatus(e.target.value)}
                      className="admin-input"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                      <option value="Other">Other</option>
                    </select>
                    {eventStatus === 'Other' && <input className="admin-input" placeholder="Enter status" value={eventCustomStatus} onChange={(e) => setEventCustomStatus(e.target.value)} required />}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date / Duration *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. October 15 - 19, 2026"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Venue Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Seminar Hall Block 2"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Event Overview & Details *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brief description of event goals, target audience, and highlights..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  {editingEventIndex === null ? 'Publish Event' : 'Save Event Changes'}
                </button>
              </form>
            </div>

            {/* List of active events */}
            <div className="content-card admin-list-card">
              <h3>Live Department Events ({store.events.length} items)</h3>
              <div className="admin-item-list">
                {store.events.map((ev, idx) => (
                  <div key={idx} className="admin-item-row">
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span className="badge-tag">{ev.tag}</span>
                        <span className={`status-pill ${ev.status === 'Upcoming' ? 'upcoming' : 'completed'}`}>
                          {ev.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ev.date}</span>
                      </div>
                      <h4 style={{ margin: '0.3rem 0 0.1rem' }}>{ev.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.venue}</p>
                    </div>
                    <div className="admin-item-actions">
                      <button type="button" onClick={() => editEvent(idx)} className="edit-item-btn" title="Edit Event"><Pencil size={15} /></button>
                      <button type="button" onClick={() => store.deleteEvent(idx)} className="delete-item-btn" title="Delete Event"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* TAB 3: FACULTY MANAGER */}
      {activeTab === 'faculty' && (
        <Reveal>
          <div className="admin-grid-layout">
            <div className="content-card admin-form-card">
              <h3>
                <Plus size={18} className="inline-icon" /> Add New Faculty Member
              </h3>
              <form onSubmit={handleCreateFaculty} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. A. K. Sharma"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Designation Role</label>
                    <select
                      value={facultyRole}
                      onChange={(e) => setFacultyRole(e.target.value)}
                      className="admin-input"
                    >
                      <option value="Head of Department & Professor">Head of Department & Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Visiting Faculty">Visiting Faculty</option>
                      <option value="Other">Other</option>
                    </select>
                    {facultyRole === 'Other' && <input className="admin-input" placeholder="Enter designation" value={facultyCustomRole} onChange={(e) => setFacultyCustomRole(e.target.value)} required />}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aksharma@ldce.ac.in"
                      value={facultyEmail}
                      onChange={(e) => setFacultyEmail(e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 10+ Years"
                      value={facultyExp}
                      onChange={(e) => setFacultyExp(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Academic Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. Ph.D. Chemical Engineering (IIT Bombay)"
                    value={facultyQual}
                    onChange={(e) => setFacultyQual(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label>Research Specialization Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. Catalysis, Polymer Synthesis, HAZOP"
                    value={facultySpec}
                    onChange={(e) => setFacultySpec(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Office Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Block 2, Room 106"
                      value={facultyOffice}
                      onChange={(e) => setFacultyOffice(e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Upload Portrait Photo</label>
                    <div className="file-upload-box">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFacultyImageUpload}
                        disabled={uploadingFacultyImg}
                        id="faculty-img-input"
                      />
                      <label htmlFor="faculty-img-input" className="file-upload-label">
                        <Upload size={16} />{' '}
                        {uploadingFacultyImg ? 'Uploading photo...' : facultyImgUrl ? 'Photo Uploaded ✓' : 'Choose Photo'}
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  {editingFacultyIndex === null ? 'Add Faculty Profile' : 'Save Faculty Changes'}
                </button>
              </form>
            </div>

            {/* List of current faculty */}
            <div className="content-card admin-list-card">
              <h3>Faculty Directory ({store.faculty.length} professors)</h3>
              <div className="admin-item-list">
                {store.faculty.map((fac, idx) => (
                  <div key={idx} className="admin-item-row">
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <img
                        src={fac.image}
                        alt={fac.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ margin: 0 }}>{fac.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {fac.role}
                        </span>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{fac.email}</p>
                      </div>
                    </div>
                    <div className="admin-item-actions">
                      <button type="button" onClick={() => editFaculty(idx)} className="edit-item-btn" title="Edit Faculty"><Pencil size={15} /></button>
                      <button type="button" onClick={() => store.deleteFaculty(idx)} className="delete-item-btn" title="Delete Faculty"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

    </main>
  );
};
