#libraries
import numpy as np
import sys
import json

try:
    fieldMatrix = sys.argv[2]
    fieldMatrix = json.loads(fieldMatrix)

    reward_position = sys.argv[1]
    reward_position = json.loads(reward_position)

    # Expanding fieldMatrix by one unit
    for row in fieldMatrix:
        row.insert(0, 0)        # Add 0 at the beginning of the row
        row.append(0)           # Add 0 at the end of the row

    fieldMatrix.insert(0, [0] * len(fieldMatrix[0]))    # Add a row of 0 at the beginning
    fieldMatrix.append([0] * len(fieldMatrix[0]))       # Add a row of 0 at the end


    # Place the reward in the provided position

    trucksInitialPos = sys.argv[3]
    trucksInitialPos = json.loads(trucksInitialPos)

    trucksIds = sys.argv[4]
    trucksIds = json.loads(trucksIds)
    print(trucksIds)

except json.JSONDecodeError:
    print('Invalid JSON syntax')


#initialization
rewards = fieldMatrix
rewards[reward_position[0]][reward_position[1]] = 100

# Change values
for i in range(len(rewards)):
  for j in range(len(rewards[i])):
      if rewards[i][j] == 1 or rewards[i][j] == 2:
          rewards[i][j] = -100
      elif rewards[i][j] == 0:
          rewards[i][j] = -1



environment_rows = len(rewards)
environment_columns = len(rewards[0])

q_values = np.zeros((environment_rows, environment_columns, 4))

#define actions
#            0       1       2       3
actions = ['up', 'right', 'down', 'left']

#define a function that determines if the specified location is a terminal state
def is_terminal_state(current_row_index, current_column_index):
    #if the reward for this location is -1, then it is not a terminal state (i.e., it is a 'white square')
    if rewards[current_row_index][current_column_index] == -1 or rewards[current_row_index][current_column_index] == 2 :
      return False
    else:
      return True

#define a function that will choose a random, non-terminal starting location
def get_starting_location():
    #get a random row and column index
    current_row_index = np.random.randint(environment_rows)
    current_column_index = np.random.randint(environment_columns)
    #continue choosing random row and column indexes until a non-terminal state is identified
    #(i.e., until the chosen state is a 'white square').
    while is_terminal_state(current_row_index, current_column_index):
      current_row_index = np.random.randint(environment_rows)
      current_column_index = np.random.randint(environment_columns)
    return current_row_index, current_column_index

#define an epsilon greedy algorithm that will choose which action to take next (i.e., where to move next)
def get_next_action(current_row_index, current_column_index, epsilon):
    #if a randomly chosen value between 0 and 1 is less than epsilon,
    #then choose the most promising value from the Q-table for this state.
    if np.random.random() < epsilon:
      return np.argmax(q_values[current_row_index, current_column_index])
    else: #choose a random action
      return np.random.randint(4)

#define a function that will get the next location based on the chosen action
def get_next_location(current_row_index, current_column_index, action_index):
    new_row_index = current_row_index
    new_column_index = current_column_index
    if actions[action_index] == 'up' and current_row_index > 0:
      new_row_index -= 1
    elif actions[action_index] == 'right' and current_column_index < environment_columns - 1:
      new_column_index += 1
    elif actions[action_index] == 'down' and current_row_index < environment_rows - 1:
      new_row_index += 1
    elif actions[action_index] == 'left' and current_column_index > 0:
      new_column_index -= 1
    return new_row_index, new_column_index

#Define a function that will get the shortest path between any location within the warehouse that
#the robot is allowed to travel and the item packaging location.

def get_shortest_path(start_row_index, start_column_index):
    #return immediately if this is an invalid starting location
    if is_terminal_state(start_row_index, start_column_index):
      return []
    else: #if this is a 'legal' starting location
      maxIterations = len(fieldMatrix[0]) * len(fieldMatrix)
      current_row_index, current_column_index = start_row_index, start_column_index
      shortest_path = []
      shortest_path.append([current_row_index, current_column_index])
      #continue moving along the path until we reach the goal (i.e., the item packaging location)
      while not is_terminal_state(current_row_index, current_column_index):
        #get the best action to take
        action_index = get_next_action(current_row_index, current_column_index, 1.)
        #move to the next location on the path, and add the new location to the list
        current_row_index, current_column_index = get_next_location(current_row_index, current_column_index, action_index)
        shortest_path.append([current_row_index, current_column_index])

        if len(shortest_path) > maxIterations:
          return []

      return shortest_path


#define training parameters
epsilon = 0.9 #the percentage of time when we should take the best action (instead of a random action)
discount_factor = 0.9 #discount factor for future rewards
learning_rate = 0.9 #the rate at which the AI agent should learn

#run through 1000 training episodes
for episode in range(1000):
    #get the starting location for this episode
    row_index, column_index = get_starting_location()

    #continue taking actions (i.e., moving) until we reach a terminal state
    #(i.e., until we reach the item packaging area or crash into an item storage location)
    while not is_terminal_state(row_index, column_index):
      #choose which action to take (i.e., where to move next)
      action_index = get_next_action(row_index, column_index, epsilon)

      #perform the chosen action, and transition to the next state (i.e., move to the next location)
      old_row_index, old_column_index = row_index, column_index #store the old row and column indexes
      row_index, column_index = get_next_location(row_index, column_index, action_index)

      #receive the reward for moving to the new state, and calculate the temporal difference
      reward = rewards[row_index][column_index]
      old_q_value = q_values[old_row_index, old_column_index, action_index]
      temporal_difference = reward + (discount_factor * np.max(q_values[row_index, column_index])) - old_q_value

      #update the Q-value for the previous state and action pair
      new_q_value = old_q_value + (learning_rate * temporal_difference)
      q_values[old_row_index, old_column_index, action_index] = new_q_value


shortest_path = get_shortest_path(trucksInitialPos[0], trucksInitialPos[1])
print(shortest_path)

