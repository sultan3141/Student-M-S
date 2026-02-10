/**
 * Teacher Layout Component
 * Manages the sidebar and navigation for the Teacher Portal.
 */
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    ChevronDownIcon,
    XMarkIcon,
    BellIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

const classNames = (...classes) => classes.filter(Boolean).join(' ');

export default function TeacherLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({
        'declare-result': route().current('teacher.declare-result.*'),
        'student-results': route().current('teacher.students.manage-results.*'),
        'teacher-assessments': route().current('teacher.assessments-simple.*'),
        'class-schedules': route().current('teacher.schedule.*')
    });
    const [expandedGrades, setExpandedGrades] = useState(() => {
        const gradeId = route().params.grade_id;
        if (gradeId) {
            return {
                [`declare-result-${gradeId}`]: route().current('teacher.declare-result.*'),
                [`student-results-${gradeId}`]: route().current('teacher.students.manage-results.*'),
                [`teacher-assessments-${gradeId}`]: route().current('teacher.assessments-simple.*'),
                [`class-schedules-${gradeId}`]: route().current('teacher.schedule.*')
            };
        }
        return {};
    });

    const toggleMenu = (id) => {
        setExpandedMenus(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleGrade = (gradeId) => {
        setExpandedGrades(prev => ({
            ...prev,
            [gradeId]: !prev[gradeId]
        }));
    };

    const navigation = [
        { name: 'Dashboard Overview', href: route('teacher.dashboard'), icon: Squares2X2Icon, current: route().current('teacher.dashboard') },
        {
            name: 'Declare Result',
            icon: ClipboardDocumentCheckIcon,
            id: 'declare-result',
            current: route().current('teacher.declare-result.*'),
            children: auth?.teacher_grades?.length > 0 ? auth.teacher_grades : null
        },
        {
            name: 'Student Results',
            icon: ChartBarIcon,
            id: 'student-results',
            current: route().current('teacher.students.manage-results'),
            children: auth?.teacher_grades?.length > 0 ? auth.teacher_grades : null
        },
        {
            name: 'Assessments',
            icon: ClipboardDocumentCheckIcon,
            id: 'teacher-assessments',
            current: route().current('teacher.assessments-simple.*') || route().current('teacher.custom-assessments.*'),
            children: auth?.teacher_grades?.length > 0 ? auth.teacher_grades : null,
            href: route('teacher.assessments-simple.index')
        },
        {
            name: 'Class Schedules',
            icon: CalendarDaysIcon,
            id: 'class-schedules',
            current: route().current('teacher.schedule'),
            children: auth?.teacher_grades?.length > 0 ? auth.teacher_grades : null,
            href: route('teacher.schedule')
        },
        { name: 'Attendance', href: route('teacher.attendance.index'), icon: CalendarDaysIcon, current: route().current('teacher.attendance.*') },
    ];

    const bottomNavigation = [
        { name: 'Profile Settings', href: route('teacher.profile.edit'), icon: Cog6ToothIcon, current: route().current('teacher.profile.edit') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Sidebar - Fixed strategy to match Student portal */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-white">Teacher</h1>
                            <p className="text-sm text-blue-200">Portal</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.children ? (
                                    <>
                                        <div className="flex items-center group mb-1">
                                            <Link
                                                href={item.href || '#'}
                                                onClick={() => setSidebarOpen(false)}
                                                className={classNames(
                                                    item.current ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                                    'flex-1 flex items-center px-4 py-3 text-sm font-medium rounded-l-xl transition-all duration-200'
                                                )}
                                            >
                                                <item.icon className={classNames(item.current ? 'text-white' : 'text-gray-400 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                                <span className="flex-1 text-left">{item.name}</span>
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleMenu(item.id);
                                                }}
                                                className={classNames(
                                                    item.current ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l border-gray-700/50',
                                                    'px-3 py-3 rounded-r-xl transition-all duration-200'
                                                )}
                                            >
                                                <ChevronDownIcon className={classNames(
                                                    expandedMenus[item.id] ? 'rotate-180' : '',
                                                    'h-4 w-4 transition-transform'
                                                )} />
                                            </button>
                                        </div>
                                        {expandedMenus[item.id] && (
                                            <div className="mt-1 mb-2 space-y-1 ml-9">
                                                {item.children.map((grade) => (
                                                    <div key={grade.id}>
                                                        <div className="flex items-center justify-between group py-1">
                                                            <Link
                                                                href={item.id === 'declare-result'
                                                                    ? route('teacher.declare-result.index', { grade_id: grade.id })
                                                                    : item.id === 'student-results'
                                                                        ? route('teacher.students.manage-results', { grade_id: grade.id })
                                                                        : item.id === 'teacher-assessments'
                                                                            ? route('teacher.assessments-simple.index', { grade_id: grade.id })
                                                                            : route('teacher.schedule', { grade_id: grade.id })}
                                                                onClick={() => setSidebarOpen(false)}
                                                                className={classNames(
                                                                    (item.id === 'declare-result' && route().current('teacher.declare-result.*') && route().params.grade_id == grade.id) ||
                                                                        (item.id === 'student-results' && route().current('teacher.students.manage-results') && route().params.grade_id == grade.id) ||
                                                                        (item.id === 'teacher-assessments' && route().current('teacher.assessments-simple.index') && route().params.grade_id == grade.id) ||
                                                                        (item.id === 'class-schedules' && route().current('teacher.schedule') && route().params.grade_id == grade.id)
                                                                        ? 'text-blue-400 font-bold'
                                                                        : 'text-gray-500 hover:text-white',
                                                                    'flex-1 text-xs transition-colors'
                                                                )}
                                                            >
                                                                {grade.name}
                                                            </Link>
                                                            {grade.sections?.length > 0 && (
                                                                <button
                                                                    onClick={() => toggleGrade(`${item.id}-${grade.id}`)}
                                                                    className="text-gray-500 hover:text-white px-2"
                                                                >
                                                                    <ChevronDownIcon className={classNames(
                                                                        expandedGrades[`${item.id}-${grade.id}`] ? 'rotate-180' : '',
                                                                        'h-3 w-3 transition-transform'
                                                                    )} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        {expandedGrades[`${item.id}-${grade.id}`] && (
                                                            <div className="ml-4 mt-1 space-y-1 border-l border-gray-700/50 pl-3">
                                                                {grade.sections?.map((section) => {
                                                                    const href = item.id === 'declare-result'
                                                                        ? route('teacher.declare-result.index', { grade_id: grade.id, section_id: section.id })
                                                                        : item.id === 'student-results'
                                                                            ? route('teacher.students.manage-results', { grade_id: grade.id, section_id: section.id })
                                                                            : item.id === 'teacher-assessments'
                                                                                ? route('teacher.assessments-simple.index', { grade_id: grade.id, section_id: section.id })
                                                                                : route('teacher.schedule', { grade_id: grade.id, section_id: section.id });

                                                                    const isSectionCurrent = (item.id === 'declare-result' && route().current('teacher.declare-result.*') && route().params.section_id == section.id) ||
                                                                        (item.id === 'student-results' && route().current('teacher.students.manage-results') && route().params.section_id == section.id) ||
                                                                        (item.id === 'teacher-assessments' && route().current('teacher.assessments-simple.index') && route().params.section_id == section.id) ||
                                                                        (item.id === 'class-schedules' && route().current('teacher.schedule') && route().params.section_id == section.id);

                                                                    return (
                                                                        <Link
                                                                            key={section.id}
                                                                            href={href}
                                                                            onClick={() => setSidebarOpen(false)}
                                                                            className={classNames(
                                                                                isSectionCurrent ? 'text-blue-300 font-bold' : 'text-gray-600 hover:text-gray-300',
                                                                                'block py-1 text-[10px] transition-colors'
                                                                            )}
                                                                        >
                                                                            Section {section.name}
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={classNames(
                                            item.current ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                            'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                        )}
                                    >
                                        <item.icon className={classNames(item.current ? 'text-white' : 'text-gray-400 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Sidebar Profile & Notifications */}
                    <div className="px-6 py-6 border-t border-gray-700/50 bg-[#1e1e2d]/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative group cursor-pointer">
                                <img
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30 transition-all group-hover:ring-blue-500"
                                    src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Teacher'}&background=random`}
                                    alt={auth?.user?.name || 'Teacher'}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#1E293B] rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate leading-tight">
                                    {auth?.user?.name || 'Teacher'}
                                </p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Teacher</p>
                            </div>
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <BellIcon className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#1E293B]"></span>
                            </button>
                        </div>

                        <div className="space-y-1">
                            {bottomNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={classNames(
                                        item.current ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                        'group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200'
                                    )}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))}

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setSidebarOpen(false)}
                                className="w-full group flex items-center px-3 py-2 text-xs font-medium text-red-400/80 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside >

            {/* Main Content Area - LG Padding Sync */}
            < div className="lg:pl-64 flex flex-col min-h-screen" >
                {/* Premium Mobile Top Bar - Synced with Student Design (lg breakpoint) */}
                < div className="sticky top-0 z-30 lg:hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] px-4 h-16 flex items-center shadow-lg border-b border-white/10" >
                    <div className="flex-1 flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-shrink-0">
                        <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">
                            Teacher Portal
                        </h1>
                    </div>

                    <div className="flex-1 flex items-center justify-end">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-2 -mr-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div >

                {/* Main Scrollable Content */}
                < main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50" >
                    {children}
                </main >

                <Footer />
            </div >
        </div >
    );
}
