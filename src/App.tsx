/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStudioDb } from './hooks/useStudioDb';
import { MacWindowChrome } from './components/MacWindowChrome';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { EmployeesView } from './components/EmployeesView';
import { DeliverablesView } from './components/DeliverablesView';
import { ClientsView } from './components/ClientsView';
import { ExpensesView } from './components/ExpensesView';
import { BillingReportsView } from './components/BillingReportsView';
import { BillingReportModal } from './components/BillingReportModal';
import { DatabaseModal } from './components/DatabaseModal';
import { SpotlightSearchModal } from './components/SpotlightSearchModal';
import { DocumentationModal } from './components/DocumentationModal';
import { Project } from './types';

export default function App() {
  const { projects, clients, employees, billingReports, config } = useStudioDb();

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal states
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [activeBillingReportId, setActiveBillingReportId] = useState<string | null>(null);
  const [showDatabaseModal, setShowDatabaseModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState<boolean>(false);

  // Global Keyboard shortcuts: Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const activeBillingReport = billingReports.find((r) => r.id === activeBillingReportId);

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj);
    setShowNewProjectModal(true);
  };

  const handleCreateNewProject = () => {
    setEditingProject(undefined);
    setShowNewProjectModal(true);
  };

  return (
    <MacWindowChrome
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      config={config}
      onOpenDatabaseModal={() => setShowDatabaseModal(true)}
      onOpenSearchModal={() => setShowSearchModal(true)}
      onOpenDocumentation={() => setShowDocumentationModal(true)}
    >
      {/* Active Tab View */}
      {activeTab === 'dashboard' && (
        <DashboardView
          projects={projects}
          employees={employees}
          clients={clients}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onNavigateToTab={(tab) => setActiveTab(tab)}
          onNewProject={handleCreateNewProject}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsView
          projects={projects}
          employees={employees}
          clients={clients}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onNewProject={handleCreateNewProject}
          onEditProject={handleEditProject}
        />
      )}

      {activeTab === 'deliverables' && (
        <DeliverablesView
          projects={projects}
          employees={employees}
          clients={clients}
          onSelectProject={(id) => setSelectedProjectId(id)}
        />
      )}

      {activeTab === 'employees' && (
        <EmployeesView
          employees={employees}
          projects={projects}
          onSelectProject={(id) => setSelectedProjectId(id)}
        />
      )}

      {activeTab === 'clients' && (
        <ClientsView
          clients={clients}
          projects={projects}
          onSelectProject={(id) => setSelectedProjectId(id)}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesView
          projects={projects}
          employees={employees}
          onSelectProject={(id) => setSelectedProjectId(id)}
        />
      )}

      {activeTab === 'billing' && (
        <BillingReportsView
          billingReports={billingReports}
          projects={projects}
          clients={clients}
          config={config}
          onOpenReport={(reportId) => setActiveBillingReportId(reportId)}
          onSelectProject={(id) => setSelectedProjectId(id)}
        />
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          employees={employees}
          clients={clients}
          onClose={() => setSelectedProjectId(null)}
          onOpenBillingReport={(repId) => {
            setSelectedProjectId(null);
            setActiveBillingReportId(repId);
          }}
        />
      )}

      {/* Project Create / Edit Modal */}
      {showNewProjectModal && (
        <ProjectFormModal
          employees={employees}
          clients={clients}
          initialProject={editingProject}
          onClose={() => setShowNewProjectModal(false)}
          onSave={(projId) => {
            setShowNewProjectModal(false);
            setSelectedProjectId(projId);
          }}
        />
      )}

      {/* Billing Report / Invoice Modal */}
      {activeBillingReport && (
        <BillingReportModal
          report={activeBillingReport}
          project={projects.find((p) => p.id === activeBillingReport.projectId)}
          client={clients.find((c) => c.id === activeBillingReport.clientId)}
          config={config}
          onClose={() => setActiveBillingReportId(null)}
        />
      )}

      {/* Local Database Modal */}
      {showDatabaseModal && (
        <DatabaseModal onClose={() => setShowDatabaseModal(false)} />
      )}

      {/* Spotlight Search Modal */}
      {showSearchModal && (
        <SpotlightSearchModal
          projects={projects}
          employees={employees}
          clients={clients}
          billingReports={billingReports}
          onClose={() => setShowSearchModal(false)}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenReport={(repId) => setActiveBillingReportId(repId)}
        />
      )}

      {/* In-App Documentation & Operating Manual Modal */}
      {showDocumentationModal && (
        <DocumentationModal onClose={() => setShowDocumentationModal(false)} />
      )}
    </MacWindowChrome>
  );
}
