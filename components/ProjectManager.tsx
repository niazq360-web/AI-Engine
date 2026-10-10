import React from 'react';
import { DesignProject, LanguageCode } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface ProjectManagerProps {
  projects: DesignProject[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenExportForProject: (project: DesignProject) => void;
  language: LanguageCode;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onOpenExportForProject,
  language
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex-1 bg-slate-50 p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200/60 uppercase tracking-wider">
                Studio Vault
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {projects.length} Saved Projects
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.savedProjects}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage client deliverables, revisions, genuine PSD source files, and delivery packages.
            </p>
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
          >
            <span>+</span>
            <span>{t.newProject}</span>
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto">
              📁
            </div>
            <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a new design brief in the AI Studio or start a blank canvas to begin designing.
            </p>
            <button
              onClick={onNewProject}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Start First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const isCurrent = proj.id === currentProjectId;

              return (
                <div
                  key={proj.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col shadow-xs hover:shadow-md ${
                    isCurrent ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Thumbnail / Preview Header */}
                  <div className="h-44 bg-slate-900 relative flex items-center justify-center overflow-hidden group">
                    {proj.previewUrl ? (
                      <img
                        src={proj.previewUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center p-6 text-slate-500">
                        <span className="text-3xl block mb-2">🎨</span>
                        <span className="text-xs font-mono">{proj.width} × {proj.height} px</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] bg-slate-900/80 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                        {proj.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {proj.language.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {proj.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {proj.brief || `${proj.subCategory} • ${proj.layers.length} Layers`}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Client: {proj.clientName || 'Direct'}</span>
                        <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-all text-center"
                      >
                        {t.openInEditor}
                      </button>

                      <button
                        onClick={() => onOpenExportForProject(proj)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        title="Export PSD / Delivery ZIP"
                      >
                        📦
                      </button>

                      <button
                        onClick={() => onDuplicateProject(proj.id)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        title="Duplicate Project"
                      >
                        📋
                      </button>

                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl text-xs font-bold transition-all"
                        title="Delete Project"
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectManager;
