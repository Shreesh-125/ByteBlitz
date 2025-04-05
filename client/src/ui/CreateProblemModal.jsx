import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/Admin.module.css';
import { TAG_OPTIONS } from '../utils/adminutils';

const CreateProblemModal = ({ show, onClose, onSubmit,isLoading  }) => {
    const { 
      register, 
      handleSubmit, 
      formState: { errors },
      reset,
      setValue,
      watch
    } = useForm({
      defaultValues: {
        sampleTestCase: [{ input: '', output: '' }],
        constraint: [''],
        tags: []
      }
    });

    const sampleTestCases = watch("sampleTestCase") || [{ input: '', output: '' }];
    const constraint = watch("constraint") || [''];

    const [tagInput, setTagInput] = useState('');
    const [filteredTags, setFilteredTags] = useState([]);
    const currentTags = watch("tags") || [];
  
    const handleFormSubmit = (data) => {
        console.log(data);
        
        // Filter out empty test cases and constraints before submitting
        const filteredTestCases = data.sampleTestCase.filter(
          tc => tc.input.trim() !== '' && tc.output.trim() !== ''
        );
        const filteredConstraints = data.constraint.filter(c => c.trim() !== '');
        
        onSubmit({
          ...data,
          sampleTestCase: filteredTestCases,
          constraint: filteredConstraints,  // Changed to match database field name
          rating:Number(data.rating)
        });
        reset();
      };

  const addTestCase = () => {
    setValue("sampleTestCase", [...sampleTestCases, { input: '', output: '' }]);
  };

  const removeTestCase = (index) => {
    if (sampleTestCases.length > 1) {
      const newTestCases = sampleTestCases.filter((_, i) => i !== index);
      setValue("sampleTestCase", newTestCases);
    }
  };

  const updateTestCase = (index, field, value) => {
    const newTestCases = [...sampleTestCases];
    newTestCases[index][field] = value;
    setValue("sampleTestCase", newTestCases);
  };

  const addConstraint = () => {
    setValue("constraint", [...constraint, '']);
  };
  const removeConstraint = (index) => {
    if (constraint.length > 1) {
      const newconstraint = constraint.filter((_, i) => i !== index);
      setValue("constraint", newconstraint);
    }
  };

  const updateConstraint = (index, value) => {
    const newconstraint = [...constraint];
    newconstraint[index] = value;
    setValue("constraint", newconstraint);
  };
  
    const handleTagInputChange = (e) => {
      const value = e.target.value;
      setTagInput(value);
      
      if (value) {
        setFilteredTags(
          TAG_OPTIONS.filter(tag => 
            tag.toLowerCase().includes(value.toLowerCase()) && 
            !currentTags.includes(tag)
          )
        );
      } else {
        setFilteredTags([]);
      }
    };
  
    const addTag = (tag) => {
      if (!currentTags.includes(tag)) {
        const newTags = [...currentTags, tag];
        setValue("tags", newTags);
      }
      setTagInput('');
      setFilteredTags([]);
    };
  
    const removeTag = (tagToRemove) => {
      const newTags = currentTags.filter(tag => tag !== tagToRemove);
      setValue("tags", newTags);
    };
  
    if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create Problem</h2>
          <button 
            className={styles.closeButton} 
            onClick={() => {
              reset();
              onClose();
            }}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={styles.formGroup}>
            <label>Question Title:</label>
            <input 
              {...register("questionTitle", { 
                required: "Question title is required" 
              })}
            />
            {errors.questionTitle && (
              <p className={styles.errorMessage}>{errors.questionTitle.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Time Limit (s):</label>
            <input 
              type="number"
              placeholder='2'
              step="0.5"
              {...register("timeLimit", { 
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
            {errors.timeLimit && (
              <p className={styles.errorMessage}>{errors.timeLimit.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Memory Limit (MB):</label>
            <input 
              type="number"
              placeholder='128'
              step="128"
              {...register("memoryLimit", { 
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
            {errors.memoryLimit && (
              <p className={styles.errorMessage}>{errors.memoryLimit.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Rating:</label>
            <input 
              type="number"
              placeholder='1200'
              step="100"
              {...register("rating", { 
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
            {errors.rating && (
              <p className={styles.errorMessage}>{errors.rating.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input 
                type="checkbox"
                id="hiddenProblem"
                {...register("hidden")}
              />
              <label htmlFor="hiddenProblem">Hidden Problem</label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Tags:</label>
            <div className={styles.tagInputContainer}>
              <div className={styles.tagsContainer}>
                {currentTags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button 
                      type="button" 
                      className={styles.tagRemove} 
                      onClick={() => removeTag(tag)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                placeholder="Search and add tags..."
                className={styles.tagInputField}
              />
              {filteredTags.length > 0 && (
                <ul className={styles.tagSuggestions}>
                  {filteredTags.map(tag => (
                    <li 
                      key={tag} 
                      onClick={() => addTag(tag)}
                      className={styles.tagSuggestionItem}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="hidden"
              {...register("tags", {
                validate: value => value.length > 0 || "At least one tag is required"
              })}
            />
            {errors.tags && (
              <p className={styles.errorMessage}>{errors.tags.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Question Description:</label>
            <textarea 
              {...register("questionDescription", { 
                required: "Question description is required" 
              })}
              placeholder="Consider a money system consisting of n coins. Each coin has..."
            />
            {errors.questionDescription && (
              <p className={styles.errorMessage}>{errors.questionDescription.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Input:</label>
            <textarea 
              {...register("input", { 
                required: "Input description is required" 
              })}
              placeholder="The first input line has two integers n and x: the number of coins..."
            />
            {errors.input && (
              <p className={styles.errorMessage}>{errors.input.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Output:</label>
            <textarea 
              {...register("output", { 
                required: "Output description is required" 
              })}
              placeholder="Print one integer: the number of ways modulo 10^9 + 7."
            />
            {errors.output && (
              <p className={styles.errorMessage}>{errors.output.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Constraints:</label>
            {constraint.map((constraint, index) => (
              <div key={index} className={styles.constraintItem}>
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => updateConstraint(index, e.target.value)}
                  placeholder={`Constraint ${index + 1}`}
                  className={styles.constraintInput}
                />
                {constraint.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className={styles.removeConstraintButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addConstraint}
              className={styles.addConstraintButton}
            >
              Add Constraint
            </button>
            {errors.constraint && (
              <p className={styles.errorMessage}>{errors.constraint.message}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Sample Test Cases:</label>
            {sampleTestCases.map((testCase, index) => (
              <div key={index} className={styles.testCaseContainer}>
                <div className={styles.testCaseHeader}>
                  <h4>Test Case #{index + 1}</h4>
                  {sampleTestCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.testCaseInput}>
                  <label>Input:</label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                    placeholder="Test case input"
                    className={styles.testCaseTextarea}
                  />
                </div>
                <div className={styles.testCaseOutput}>
                  <label>Output:</label>
                  <textarea
                    value={testCase.output}
                    onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                    placeholder="Expected output"
                    className={styles.testCaseTextarea}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              className={styles.addButton}
            >
              Add Test Case
            </button>
            {errors.sampleTestCase && (
              <p className={styles.errorMessage}>{errors.sampleTestCase.message}</p>
            )}
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={isLoading} >
            {isLoading ? 'Creating...' : 'Create Problem'}
            </button>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={() => {
                reset();
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

export default CreateProblemModal;