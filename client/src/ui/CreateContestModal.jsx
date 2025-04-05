import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/Admin.module.css';
import toast from 'react-hot-toast';

const CreateContestModal = ({ show, onClose, onSubmit, isLoading }) => {
  const [contestProblems, setContestProblems] = useState([]);

  const { 
    register: registerContest, 
    handleSubmit: handleSubmitContest,
    formState: { errors: contestErrors },
    reset: resetContestForm,
    watch: watchContest,
  } = useForm({
    defaultValues: {
      status: "upcoming"
    }
  });

  const { 
    register: registerNewProblem,
    handleSubmit: handleSubmitNewProblem,
    formState: { errors: newProblemErrors },
    reset: resetNewProblemForm,
    setError: setNewProblemError,
    clearErrors: clearNewProblemErrors,
  } = useForm();

  const handleContestSubmit = async (data) => {
      const contestData = {
        problems: contestProblems.map(prob => prob.problem),
        submissions: [],
        registeredUser: [],
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        problemScore: contestProblems.map(prob => ({
          problemId: prob.problem,
          problemScore: prob.score
        }))
      };
      
     onSubmit(contestData);
      resetContestForm();
      setContestProblems([]);
    
  };

  const addProblemToContest = handleSubmitNewProblem((data) => {
    // Check if problem already exists
    if (contestProblems.some(p => p.problem === data.problem)) {
      setNewProblemError("problem", {
        type: "manual",
        message: "This problem is already added"
      });
      return;
    }
    
    setContestProblems(prev => [...prev, {
      problem: data.problem,
      score: data.score
    }]);
     // Only reset the problem form fields, not the entire form
    resetNewProblemForm({
      problem: '',
      score: ''
    });
    
    clearNewProblemErrors();
  });

  const removeProblemFromContest = (index) => {
    setContestProblems(prev => prev.filter((_, i) => i !== index));
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create Contest</h2>
          <button 
            className={styles.closeButton} 
            onClick={() => {
              resetContestForm();
              setContestProblems([]);
              onClose();
            }}
            disabled={isLoading}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmitContest(handleContestSubmit)}>
          <div className={styles.formGroup}>
            <label>Start Time:</label>
            <div className={styles.dateTimeInput}>
              <input 
                type="datetime-local" 
                {...registerContest("startTime", { 
                  required: "Start time is required"
                })}
              />
            </div>
            {contestErrors.startTime && (
              <p className={styles.errorMessage}>{contestErrors.startTime.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>End Time:</label>
            <div className={styles.dateTimeInput}>
              <input 
                type="datetime-local" 
                {...registerContest("endTime", { 
                  required: "End time is required",
                  validate: (value) => {
                    const startTime = watchContest("startTime");
                    return new Date(value) > new Date(startTime) || 
                      "End time must be after start time";
                  }
                })}
              />
            </div>
            {contestErrors.endTime && (
              <p className={styles.errorMessage}>
                {contestErrors.endTime.message}
              </p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Status:</label>
            <select 
              {...registerContest("status", { required: "Status is required" })}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="ended">Ended</option>
            </select>
            {contestErrors.status && (
              <p className={styles.errorMessage}>{contestErrors.status.message}</p>
            )}
          </div>
          
          <div className={styles.problemsSection}>
            <h3>Add Problems to Contest</h3>
            
            <div className={styles.addProblemForm}>
              <div className={styles.formGroup}>
                <label>Problem ID:</label>
                <input 
                  type="number"
                  placeholder='e.g. 1'
                  {...registerNewProblem("problem", { 
                    required: "Problem ID is required",
                    min: { value: 1, message: "ID must be positive" }
                  })}
                />
                {newProblemErrors.problem && (
                  <p className={styles.errorMessage}>{newProblemErrors.problem.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Problem Score:</label>
                <input 
                  type="number" 
                  placeholder='e.g. 500'
                  {...registerNewProblem("score", { 
                    required: "Score is required",
                    min: { value: 1, message: "Score must be positive" }
                  })}
                />
                {newProblemErrors.score && (
                  <p className={styles.errorMessage}>{newProblemErrors.score.message}</p>
                )}
              </div>
              
              <button 
                type="button"
                className={styles.addButton}
                onClick={addProblemToContest}
                disabled={isLoading}
              >
                Add Problem
              </button>
            </div>
            
            {contestProblems.length > 0 && (
              <div className={styles.problemsList}>
                <h4>Contest Problems ({contestProblems.length}):</h4>
                <table className={styles.problemsTable}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Score</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contestProblems.map((problem, index) => (
                      <tr key={index}>
                        <td>{problem.problem}</td>
                        <td>{problem.score}</td>
                        <td>
                          <button 
                            type="button" 
                            className={styles.removeButton}
                            onClick={() => removeProblemFromContest(index)}
                            disabled={isLoading}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading || contestProblems.length === 0}
            >
              {isLoading ? 'Creating...' : 'Create Contest'}
            </button>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={() => {
                resetContestForm();
                setContestProblems([]);
                onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContestModal;