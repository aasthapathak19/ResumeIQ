import React from 'react';

type Tab = "analysis" | "cover-letter" | "interview";

interface TabItem {
    id: Tab;
    label: string;
    icon: string;
}

interface ResultTabsProps {
    tabs: TabItem[];
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const ResultTabs: React.FC<ResultTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="result-tabs no-print">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`result-tab ${activeTab === tab.id ? "result-tab-active" : ""}`}
                    onClick={() => onTabChange(tab.id)}
                    id={`tab-${tab.id}`}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ResultTabs;
