import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/Admin.module.css';

const AdminDashboard = () => {
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [contestProblems, setContestProblems] = useState([]);
  const [showInlineCreation, setShowInlineCreation] = useState(false);

  const { 
    register: registerProblem, 
    handleSubmit: handleSubmitProblem, 
    formState: { errors: problemErrors },
    reset: resetProblemForm
  } = useForm({
    defaultValues: {}
  });

  const { 
    register: registerContest, 
    handleSubmit: handleSubmitContest,
    formState: { errors: contestErrors },
    reset: resetContestForm,
    watch: watchContest
  } = useForm({
    defaultValues: {}
  });

  const { 
    register: registerNewProblem,
    handleSubmit: handleSubmitNewProblem,
    formState: { errors: newProblemErrors },
    reset: resetNewProblemForm,
    watch: watchNewProblem
  } = useForm({
    defaultValues: {}
  });

  const onSubmitProblem = (data) => {
    console.log("Problem Data:", data);
    resetProblemForm();
    setShowProblemModal(false);
  };

  const onSubmitContest = (data) => {
    const contestData = {
      ...data,
      problems: contestProblems
    };
    console.log("Contest Data:", contestData);
    resetContestForm();
    setContestProblems([]);
    setShowContestModal(false);
  };

  const addProblemToContest = handleSubmitNewProblem((data) => {
    setContestProblems(prev => [...prev, data]);
    resetNewProblemForm();
  });

  const removeProblemFromContest = (index) => {
    setContestProblems(prev => prev.filter((_, i) => i !== index));
  };

  const handleProblemChange = (e) => {
    const value = e.target.value;
    if (value === "create") {
      setShowInlineCreation(true);
    } else {
      setShowInlineCreation(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      
      <div className={styles.buttonContainer}>
        <button 
          className={styles.button} 
          onClick={() => setShowProblemModal(true)}
        >
          Create Problems
        </button>
        <button 
          className={styles.button} 
          onClick={() => setShowContestModal(true)}
        >
          Create Contest
        </button>
      </div>

      {/* Create Problem Modal */}
      {showProblemModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Create Problem</h2>
              <button 
                className={styles.closeButton} 
                onClick={() => {
                  resetProblemForm();
                  setShowProblemModal(false);
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitProblem(onSubmitProblem)}>
              <div className={styles.formGroup}>
                <label>Question Title:</label>
                <input 
                  {...registerProblem("title", { 
                    required: "Question title is required" 
                  })}
                />
                {problemErrors.title && (
                  <p className={styles.errorMessage}>{problemErrors.title.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Time Limit (s):</label>
                <input 
                  type="number"
                  placeholder='2'
                  step="0.5"
                  {...registerProblem("timeLimit", { 
                    required: "Time limit is required",
                    min: {
                      value: 0,
                      message: "Time limit must be greater than or equal to 0"
                    },
                    max: {
                      value: 10,
                      message: "Time limit must be less than or equal to 10 seconds"
                    }
                  })}
                />
                {problemErrors.timeLimit && (
                  <p className={styles.errorMessage}>{problemErrors.timeLimit.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Memory Limit (MB):</label>
                <input 
                  type="number"
                  placeholder='128'
                  step="128"
                  {...registerProblem("memoryLimit", { 
                    required: "Memory limit is required",
                    min: {
                      value: 1,
                      message: "Memory limit must be a positive number"
                    },
                    max: {
                      value: 1024,
                      message: "Memory limit should not exceed 1024 MB"
                    }
                  })}
                />
                {problemErrors.memoryLimit && (
                  <p className={styles.errorMessage}>{problemErrors.memoryLimit.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Rating:</label>
                <input 
                  type="number"
                  placeholder='1200'
                  step="100"
                  {...registerProblem("rating", { 
                    required: "Rating is required",
                    min: {
                      value: 800,
                      message: "Rating must be at least 800"
                    },
                    max: {
                      value: 3500,
                      message: "Rating should not exceed 3500"
                    }
                  })}
                />
                {problemErrors.rating && (
                  <p className={styles.errorMessage}>{problemErrors.rating.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxContainer}>
                  <input 
                    type="checkbox"
                    id="hiddenProblem"
                    {...registerProblem("hidden")}
                  />
                  <label htmlFor="hiddenProblem">Hidden Problem</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Tags:</label>
                <input 
                  type="text"
                  placeholder='dp, graph, strings (comma-separated)'
                  {...registerProblem("tags", { 
                    required: "At least one tag is required"
                  })}
                />
                {problemErrors.tags && (
                  <p className={styles.errorMessage}>{problemErrors.tags.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Question Description:</label>
                <textarea 
                  {...registerProblem("description", { 
                    required: "Question description is required" 
                  })}
                  placeholder="Consider a money system consisting of n coins. Each coin has..."
                />
                {problemErrors.description && (
                  <p className={styles.errorMessage}>{problemErrors.description.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Input:</label>
                <textarea 
                  {...registerProblem("input", { 
                    required: "Input description is required" 
                  })}
                  placeholder="The first input line has two integers n and x: the number of coins..."
                />
                {problemErrors.input && (
                  <p className={styles.errorMessage}>{problemErrors.input.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Output:</label>
                <textarea 
                  {...registerProblem("output", { 
                    required: "Output description is required" 
                  })}
                  placeholder="Print one integer: the number of ways modulo 10^9 + 7."
                />
                {problemErrors.output && (
                  <p className={styles.errorMessage}>{problemErrors.output.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Constraints:</label>
                <textarea 
                  {...registerProblem("constraints", { 
                    required: "Constraints are required" 
                  })}
                  placeholder="1<=n <= 100"
                />
                {problemErrors.constraints && (
                  <p className={styles.errorMessage}>{problemErrors.constraints.message}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Sample Test Case:</label>
                <textarea 
                  {...registerProblem("sampleTestCase", { 
                    required: "Sample test case is required" 
                  })}
                />
                {problemErrors.sampleTestCase && (
                  <p className={styles.errorMessage}>{problemErrors.sampleTestCase.message}</p>
                )}
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Create Problem
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton} 
                  onClick={() => {
                    resetProblemForm();
                    setShowProblemModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Contest Modal */}
      {showContestModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Create Contest</h2>
              <button 
                className={styles.closeButton} 
                onClick={() => {
                  resetContestForm();
                  setContestProblems([]);
                  setShowContestModal(false);
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitContest(onSubmitContest)}>
              <div className={styles.formGroup}>
                <label>Registered Users:</label>
                <input 
                  type="number"
                  {...registerContest("registeredUsers", { 
                    required: "Registered users count is required",
                    min: {
                      value: 1,
                      message: "Registered users must be a positive integer"
                    },
                    validate: {
                      integer: v => Number.isInteger(Number(v)) || "Value must be an integer"
                    }
                  })}
                />
                {contestErrors.registeredUsers && (
                  <p className={styles.errorMessage}>{contestErrors.registeredUsers.message}</p>
                )}
              </div>
              
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
                      required: "End time is required"
                    })}
                  />
                </div>
                {contestErrors.endTime && (
                  <p className={styles.errorMessage}>{contestErrors.endTime.message}</p>
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
                {!showInlineCreation && (
                  <form className={styles.addProblemForm} onSubmit={addProblemToContest}>
                    <div className={styles.formGroup}>
                      <label>Problem Id:</label>
                      <input 
                        type="number"
                        placeholder='69'
                        {...registerNewProblem("problem", { 
                          required: "Problem id is required" 
                        })}
                        onChange={handleProblemChange}
                      />
                      {newProblemErrors.problem && (
                        <p className={styles.errorMessage}>{newProblemErrors.problem.message}</p>
                      )}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Submissions:</label>
                      <input 
                        type="number" 
                        placeholder='1000'
                        {...registerNewProblem("submissions", { 
                          required: "Submissions count is required",
                          min: {
                            value: 1,
                            message: "Submissions must be a positive integer"
                          },
                          validate: {
                            integer: v => Number.isInteger(Number(v)) || "Value must be an integer"
                          }
                        })}
                      />
                      {newProblemErrors.submissions && (
                        <p className={styles.errorMessage}>{newProblemErrors.submissions.message}</p>
                      )}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Problem Score:</label>
                      <input 
                        type="number" 
                        placeholder='750'
                        {...registerNewProblem("score", { 
                          required: "Problem score is required",
                          min: {
                            value: 1,
                            message: "Score must be a positive integer"
                          },
                          validate: {
                            integer: v => Number.isInteger(Number(v)) || "Value must be an integer"
                          }
                        })}
                      />
                      {newProblemErrors.score && (
                        <p className={styles.errorMessage}>{newProblemErrors.score.message}</p>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className={styles.addButton}
                      onClick={addProblemToContest}
                    >
                      Add Problem
                    </button>
                  </form>
                )}
                
                {contestProblems.length > 0 && (
                  <div className={styles.problemsList}>
                    <h4>Problems in this Contest:</h4>
                    <table className={styles.problemsTable}>
                      <thead>
                        <tr>
                          <th>Problem id</th>
                          <th>Submissions</th>
                          <th>Score</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contestProblems.map((problem, index) => (
                          <tr key={index}>
                            <td>{problem.problem}</td>
                            <td>{problem.submissions}</td>
                            <td>{problem.score}</td>
                            <td>
                              <button 
                                type="button" 
                                className={styles.removeButton}
                                onClick={() => removeProblemFromContest(index)}
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
                >
                  Create Contest
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton} 
                  onClick={() => {
                    resetContestForm();
                    setContestProblems([]);
                    setShowContestModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
