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
    ChevronDownIcon
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
        { name: 'Dashboard Overview', href: route('teacher.dashboard'), icon: HomeIcon, current: route().current('teacher.dashboard') },
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

            {/* Main Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <AcademicCapIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wide">EduPanel</span>
                    </div>
                    <button className="md:hidden ml-auto text-gray-400" onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
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

                    {/* Bottom Navigation (Settings & Logout) */}
                    <div className="px-4 py-6 space-y-1 border-t border-gray-700/50">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-white" />
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                            <span>Logout</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Premium Header - Refactored for Mobile Centered Branding */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 h-16 flex items-center shadow-sm border-b border-gray-100">
                    {/* Mobile Menu Button - Left */}
                    <div className="flex-1 flex items-center px-4 md:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 hover:text-navy-900 transition-colors">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Desktop Content - Left */}
                    <div className="hidden md:flex flex-1 items-center px-8 gap-4">
                        <div className="flex items-center gap-2">
                            <HomeIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-black text-navy-900 uppercase tracking-[0.3em]">Teacher Dashboard</span>
                        </div>
                    </div>

                    {/* Centered Branding - Mobile Only */}
                    <div className="md:hidden flex-shrink-0">
                        <h1 className="text-base font-bold text-navy-900 tracking-tight">
                            Teacher Portal
                        </h1>
                    </div>

                    {/* Right Side Content (Profile/Notifications) */}
                    <div className="flex items-center px-4 md:px-8 space-x-4 flex-1 justify-end">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-blue-600 rounded-xl transition-all">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

                        {/* Profile Dropdown Snippet */}
                        <div className="flex items-center group cursor-pointer">
                            <span className="text-sm font-bold text-navy-900 mr-3 hidden sm:block group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                                {auth?.user?.name || 'Teacher'}
                            </span>
                            <div className="relative">
                                <img
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 shadow-md group-hover:ring-blue-600 transition-all"
                                    src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Teacher'}&background=random`}
                                    alt={auth?.user?.name || 'Teacher'}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}
