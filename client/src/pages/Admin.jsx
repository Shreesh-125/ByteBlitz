import React, { useState } from 'react';
import styles from '../styles/Admin.module.css';
import CreateProblemModal from '../ui/CreateProblemModal';
import CreateContestModal from '../ui/CreateContestModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postContest, postProblem } from '../servers/adminpage';
import toast from 'react-hot-toast';
// import CreateProblemModal from './admin/CreateProblemModal';
// import CreateContestModal from './admin/CreateContestModal';

const AdminDashboard = () => {
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const queryClient = useQueryClient();

  const problemMutation = useMutation({
    mutationFn: postProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      setShowProblemModal(false);
      // Add success toast/notification here
    },
    onError: (error) => {
      console.error('Error creating problem:', error);
      // Add error toast/notification here
    }
  });

  const contestMutation = useMutation({
    mutationFn: postContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      setShowContestModal(false);
      toast.success('Contest created successfully!');
    },
    onError: (error) => {
      console.error('Error creating contest:', error);
      
      // Check for network errors first
      if (error.message === 'Network Error') {
        return toast.error('Network error - please check your connection');
      }
  
      // Handle backend errors
      if (error.response) {
        const backendError = error.response.data;
        
        // Specific handling for invalid problem IDs
        if ( backendError.message.includes('Invalid problem IDs')) {
              
          return toast.error(backendError.message, {
            duration: 6000,
            style: {
              background: '#ffebee',
              color: '#c62828',
              fontSize: '14px',
              padding: '16px',
            }
          });
        }
  
        // Generic backend error handling
        return toast.error(backendError.message || 'Failed to create contest');
      }
  
      // Fallback error
      toast.error('An unexpected error occurred');
    }
  });

  const handleProblemSubmit = (data) => {
    console.log(data);
    
    const formattedData = {
      questionTitle: data.questionTitle,
      timeLimit: `${data.timeLimit}s`, // Add 's' suffix
      memoryLimit: `${data.memoryLimit}MB`, // Add 'MB' suffix
      questionDescription: {
        questionDesc: data.questionDescription,
        input: data.input,
        output: data.output,
        constraint: data.constraint.filter(c => c.trim() !== '') // Note: using constraints from form
      },
      sampleTestCase: data.sampleTestCase.filter(
        tc => tc.input.trim() !== '' && tc.output.trim() !== ''
      ),
      rating: Number(data.rating),
      hidden: data.hidden || false, // Default to false if not provided
      tags: data.tags
    };
  
    problemMutation.mutate(formattedData);
  };

  const handleContestSubmit = (data) => {
    
    // Format contest data if needed
    const formattedData = {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime)
    };
    contestMutation.mutate(formattedData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      
      <div className={styles.buttonContainer}>
        <button 
          className={styles.button} 
          onClick={() => setShowProblemModal(true)}
          disabled={problemMutation.isPending}
        >
          {problemMutation.isPending ? 'Creating...' : 'Create Problems'}
        </button>
        <button 
          className={styles.button} 
          onClick={() => setShowContestModal(true)}
          disabled={contestMutation.isPending}
        >
          {contestMutation.isPending ? 'Creating...' : 'Create Contest'}
        </button>
      </div>

      <CreateProblemModal 
        show={showProblemModal}
        onClose={() => setShowProblemModal(false)}
        onSubmit={handleProblemSubmit}
        isLoading={problemMutation.isPending}
      />

      <CreateContestModal
        show={showContestModal}
        onClose={() => setShowContestModal(false)}
        onSubmit={handleContestSubmit}
        isLoading={contestMutation.isPending}
      />
    </div>
  );
};

export default AdminDashboard;