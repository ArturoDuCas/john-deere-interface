import numpy as np
import heapq
import random
import json
import sys

"""
Created on Mon Sep  4 9:53:44 2023

@author: oscar
"""

import numpy as np
import heapq
import random

def parse_matrix(matrix):
    # Check if the matrix is a flat list
    if isinstance(matrix, list) and all(isinstance(item, int) for item in matrix):
        # Determine the number of columns (you may need to adjust this)
        num_cols = len(matrix)
        # Determine the number of rows (you may need to adjust this)
        num_rows = len(matrix) // num_cols

        # Convert the flat list into a list of lists
        matrix = [matrix[i:i+num_cols] for i in range(0, len(matrix), num_cols)]

    return matrix

def shortest_path(matrix, start, end):
    rows, cols = len(matrix), len(matrix[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    visited = [[False] * cols for _ in range(rows)]
    min_distance = [[float('inf')] * cols for _ in range(rows)]
    min_distance[start[0]][start[1]] = 0
    pq = [(0, start)]
    paths = [[None] * cols for _ in range(rows)]

    while pq:
        current_distance, current_vertex = heapq.heappop(pq)
        
        if current_vertex == end:
            path = []
            i, j = end
            while (i, j) != start:
                path.append((i, j))
                i, j = paths[i][j]
            path.append(start)
            path.reverse()
            return current_distance, path
        
        i, j = current_vertex
        if visited[i][j]:
            continue
        visited[i][j] = True

        for x, y in directions:
            ni, nj = i + x, j + y
            if 0 <= ni < rows and 0 <= nj < cols:
                distance = current_distance + 1
                if distance < min_distance[ni][nj]:
                    min_distance[ni][nj] = distance
                    heapq.heappush(pq, (distance, (ni, nj)))
                    paths[ni][nj] = (i, j)

    return float('inf'), []
def tsp(matrix, start_point):
    # print(matrix)
    points = [(i, j) for i in range(len(matrix[0])) for j in range(len(matrix[0])) if matrix[i][j] == 1]
    # print("points: ", points)

    num_points = len(points)
    distance_matrix = [[0] * num_points for _ in range(num_points)]
    
    for i in range(num_points):
        for j in range(i+1, num_points):
            distance, _ = shortest_path(matrix, points[i], points[j])
            distance_matrix[i][j] = distance_matrix[j][i] = distance
    
    min_distance = float('inf')
    best_order = None
        # Si aucun point de départ n'est fourni, choisissez un point aléatoire de la frontière comme avant
    if not start_point:
        border_points = [points[i] for i in range(num_points) if 
                         points[i][0] == 0 or 
                         points[i][1] == 0 or 
                         points[i][0] == len(matrix) - 1 or 
                         points[i][1] == len(matrix[0]) - 1]
        start_point = random.choice(border_points)
    
    start_point = tuple(start_point)
    start_index = points.index(start_point)
    
    visited = [False] * num_points
    visited[start_index] = True
    current_distance = 0
    order = [start_index]
    
    while len(order) < num_points:
        next_point = None
        min_next_distance = float('inf')
        for j in range(num_points):
            if not visited[j] and distance_matrix[order[-1]][j] < min_next_distance:
                min_next_distance = distance_matrix[order[-1]][j]
                next_point = j
        current_distance += min_next_distance
        visited[next_point] = True
        order.append(next_point)
    
    current_distance += distance_matrix[order[-1]][order[0]]
    if current_distance < min_distance:
        min_distance = current_distance
        best_order = order
    
    path = [points[best_order[0]]]
    for i in range(1, len(best_order)):
        _, sub_path = shortest_path(matrix, points[best_order[i-1]], points[best_order[i]])
        path += sub_path[1:]
    
    return min_distance, [points[i] for i in best_order], path


# def split_matrix(matrix, start_positions):
#     left_matrix = []
#     right_matrix = []

#     for i in range(len(matrix)):
#         for j in range(len(matrix[0])):
#             if (i, j) in start_positions:
#                 # Include the starting point in the appropriate submatrix
#                 if j < len(matrix[0]) // 2:
#                     left_matrix.append(matrix[i])  # Append the entire row
#                 else:
#                     right_matrix.append(matrix[i])  # Append the entire row
#             elif j < len(matrix[0]) // 2:
#                 left_matrix.append(matrix[i])  # Append the entire row
#             else:
#                 right_matrix.append(matrix[i])  # Append the entire row


#     # print("left matrix", left_matrix)
#     # print("right matrix: ", right_matrix)
#     return left_matrix, right_matrix

def split_matrix(matrix, start_positions):
    left_matrices = []
    right_matrices = []

    cols = len(matrix[0])

    for i in range(len(matrix)):
        left_row = []
        right_row = []
        for j in range(cols):
            if (i, j) in start_positions:
                # Include the starting point in the appropriate submatrix
                if j < cols // 2:
                    left_row.append(matrix[i][j])
                else:
                    right_row.append(matrix[i][j])
            elif j < cols // 2:
                left_row.append(matrix[i][j])
            else:
                right_row.append(matrix[i][j])

        left_matrices.append(left_row)
        right_matrices.append(right_row)

    return left_matrices, right_matrices


def compute_path(matrix, start_position_index, start_positions):
    start_point = start_positions[start_position_index]
    min_distance, best_order, path = tsp(matrix, start_point)
    return min_distance, best_order, path

# matrix = [
#     [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
#     [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
# ]

def main(): 

    if len(sys.argv) < 2:
        print("Usage: python python_script.py field_matrix_json")
        sys.exit(1)

    try:

        print("Entra al python")

        starting_points = sys.argv[1]

        # Parse the JSON
        new_starting_points = json.loads(starting_points)

        # print("new_points_dic", new_points_dic, type(new_points_dic))

        # new_starting_points = new_points_dic.get('Data',[])


        field_matrix = sys.argv[2]
        # print("field_matrix", field_matrix)


        # Parse the JSON
        matrix = json.loads(field_matrix)
        matrix = parse_matrix(matrix)

        print(matrix)
        # print("field_matrix", field_matrix, type(field_matrix))

        # matrix = new_points_dic.get('Data',[])


    except json.JSONDecodeError:
        print('Invalid JSON syntax')

    matrix_left, matrix_right = split_matrix(matrix, new_starting_points)

    min_distance_left, best_order_left, path_left = compute_path(matrix_left,0 ,new_starting_points)
    min_distance_right, best_order_right, path_right = compute_path(matrix_right, 1, new_starting_points)
    path_right_offset = [(x, y + len(matrix_left[0])) for x, y in path_right]

    object1_path = path_left + path_right_offset
    object2_path = path_right_offset + path_left

    print("Object 1 Path:", object1_path)
    # print("Object 1 Total Distance:", min_distance_left + min_distance_right)
    # print("Object 1 Best Order:", best_order_left + [(x, y + len(matrix_left[0])) for x, y in best_order_right])

    print("Object 2 Path:", object2_path)
    # print("Object 2 Total Distance:", min_distance_right + min_distance_left)
    # print("Object 2 Best Order:", [(x, y + len(matrix_left[0])) for x, y in best_order_right] + best_order_left)

if __name__ == "__main__":
    main()
