
import React, { useState } from 'react';
import { FolderIcon, PlusIcon, ThreeDotsIcon, ArchiveIcon } from '../components/Icons';
import { Project } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const mockProjects: Project[] = [
    { id: '1', title: 'Website Redesign', description: 'AI-assisted copywriting and coding for the new site.', status: 'active', tasks: 12, files: 4, lastActive: '2h ago' },
    { id: '2', title: 'Thesis Research', description: 'Collecting and summarizing papers on ML.', status: 'active', tasks: 5, files: 15, lastActive: '1d ago' },
    { id: '3', title: 'Q1 Marketing Plan', description: 'Social media strategy and content calendar.', status: 'archived', tasks: 8, files: 2, lastActive: '1w ago' },
];

const ProjectsPage: React.FC = () => {
    const { t, language } = useLanguage();
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const fontClass = language === 'am' ? 'font-amharic' : '';

    const handleCreateProject = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: t('projects.newProject'),
            description: '...',
            status: 'active',
            tasks: 0,
            files: 0,
            lastActive: 'Just now'
        };
        setProjects([newProject, ...projects]);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-6">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FolderIcon className="w-8 h-8 text-purple-500" />
                        <h1 className={`text-3xl font-bold text-gray-100 ${fontClass}`}>{t('projects.title')}</h1>
                    </div>
                    <p className={`text-gray-400 ${fontClass}`}>{t('projects.description')}</p>
                </div>
                <button 
                    onClick={handleCreateProject}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span className={fontClass}>{t('projects.newProject')}</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
                {projects.map(project => (
                    <div key={project.id} className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition-all flex flex-col h-64 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${project.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                {project.status === 'active' ? t('projects.status.active') : t('projects.status.archived')}
                            </div>
                            <button className="text-gray-500 hover:text-white"><ThreeDotsIcon className="w-5 h-5" /></button>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-100 mb-2">{project.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-auto">{project.description}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm text-gray-500">
                            <div className="flex gap-4">
                                <span>{project.tasks} {t('projects.stats.tasks')}</span>
                                <span>{project.files} {t('projects.stats.files')}</span>
                            </div>
                            <span>{project.lastActive}</span>
                        </div>
                    </div>
                ))}
                
                {/* Dashed Create Card */}
                <button 
                    onClick={handleCreateProject}
                    className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-all h-64"
                >
                    <div className="p-3 bg-gray-800 rounded-full mb-3">
                         <PlusIcon className="w-6 h-6" />
                    </div>
                    <span className={`font-medium ${fontClass}`}>{t('projects.createCard')}</span>
                </button>
            </div>
        </div>
    );
};

export default ProjectsPage;
