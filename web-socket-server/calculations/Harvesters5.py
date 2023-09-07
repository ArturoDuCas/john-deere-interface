import numpy as np
import heapq
import random
import sys
import json

# -*- coding: utf-8 -*-
"""
Created on Mon Sep  4 9:53:44 2023

@author: oscar
"""

import numpy as np
import heapq
import random
# =========================
# Shortest Path Calculation
# =========================
def shortest_path(matrix, start, end):
    """
    Find the shortest path between start and end points in a binary matrix using Dijkstra's algorithm.
    
    Parameters:
    - matrix: 2D list containing 0's and 1's.
    - start: Tuple of start point (row, column).
    - end: Tuple of end point (row, column).
    
    Returns:
    - Minimum distance between start and end.
    - Path as list of points (row, column) from start to end.
    """
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

def tsp(matrix):
    """
    Solve the Travelling Salesman Problem for points in the matrix marked by 1's.
    
    Parameters:
    - matrix: 2D list containing 0's and 1's.
    
    Returns:
    - Minimum total distance to visit all points.
    - Order of visited points.
    - Complete path with the shortest route.
    """
    points = [(i, j) for i in range(len(matrix)) for j in range(len(matrix[0])) if matrix[i][j] == 1]
    num_points = len(points)
    distance_matrix = [[0] * num_points for _ in range(num_points)]
    
    for i in range(num_points):
        for j in range(i+1, num_points):
            distance, _ = shortest_path(matrix, points[i], points[j])
            distance_matrix[i][j] = distance_matrix[j][i] = distance
    
    min_distance = float('inf')
    best_order = None
    border_points = [points[i] for i in range(num_points) if 
                     points[i][0] == 0 or 
                     points[i][1] == 0 or 
                     points[i][0] == len(matrix) - 1 or 
                     points[i][1] == len(matrix[0]) - 1]
    start_point = random.choice(border_points)
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
# ==========================
# Matrix Splitting Functions
# ==========================

def split_matrix(matrix):
    mid_col = len(matrix[0]) // 2
    matrix_left = [row[:mid_col] for row in matrix]
    matrix_right = [row[mid_col:] for row in matrix]
    return matrix_left, matrix_right


def split_matrix_three(matrix):
    third_col = len(matrix[0]) // 3
    matrix_left = [row[:third_col] for row in matrix]
    matrix_middle = [row[third_col:2*third_col] for row in matrix]
    matrix_right = [row[2*third_col:] for row in matrix]
    return matrix_left, matrix_middle, matrix_right

def split_matrix_four(matrix):
    half_row = len(matrix) // 2
    half_col = len(matrix[0]) // 2

    top_left = [row[:half_col] for row in matrix[:half_row]]
    top_right = [row[half_col:] for row in matrix[:half_row]]
    bottom_left = [row[:half_col] for row in matrix[half_row:]]
    bottom_right = [row[half_col:] for row in matrix[half_row:]]

    return top_left, top_right, bottom_left, bottom_right
def split_matrix_five(matrix):
    half_col = len(matrix[0]) // 2

    third_rows = len(matrix) // 3

    left_half = matrix
    right_half = [row[half_col:] for row in matrix]

    top_left = left_half[:third_rows]
    bottom_left = left_half[third_rows:2*third_rows]

    top_right = right_half[:third_rows]
    middle_right = right_half[third_rows:2*third_rows]
    bottom_right = right_half[2*third_rows:]

    return top_left, bottom_left, top_right, middle_right, bottom_right
# ==========================
# Main Execution and output
# ==========================

def compute_path(matrix):
    min_distance, best_order, path = tsp(matrix)
    return min_distance, best_order, path
# ==========================
# Matrix
# ==========================

matrix = [
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
]
 

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
        # print("field_matrix", field_matrix, type(field_matrix))

        # matrix = new_points_dic.get('Data',[])


    except json.JSONDecodeError:
        print('Invalid JSON syntax')

    NUM_HARVESTERS = len(new_starting_points)

    if NUM_HARVESTERS == 1:
        min_distance, best_order, path = compute_path(matrix)
        print("Harvester Path:", path)
        # print("Total Distance:", min_distance)
        # print("Best Order:", best_order)

    elif NUM_HARVESTERS == 2:
        matrix_left, matrix_right = split_matrix(matrix)
        min_distance_left, best_order_left, path_left = compute_path(matrix_left)
        min_distance_right, best_order_right, path_right = compute_path(matrix_right)

        path_right_offset = [(x, y + len(matrix_left[0])) for x, y in path_right]

        object1_path = path_left + path_right_offset
        object2_path = path_right_offset + path_left

        print("Object 1 Path:", object1_path)
        #print("Object 1 Total Distance:", min_distance_left + min_distance_right)
        #print("Object 1 Best Order:", best_order_left + [(x, y + len(matrix_left[0])) for x, y in best_order_right])

        print("Object 2 Path:", object2_path)
        #print("Object 2 Total Distance:", min_distance_right + min_distance_left)
        #print("Object 2 Best Order:", [(x, y + len(matrix_left[0])) for x, y in best_order_right] + best_order_left)

    elif NUM_HARVESTERS == 3:
        matrix_left, matrix_middle, matrix_right = split_matrix_three(matrix)
        
        # Calculate paths for the left, middle and right matrix sections.
        min_distance_left, best_order_left, path_left = compute_path(matrix_left)
        min_distance_middle, best_order_middle, path_middle = compute_path(matrix_middle)
        min_distance_right, best_order_right, path_right = compute_path(matrix_right)

        # Adjust for offset if the matrix was split.
        path_middle_offset = [(x, y + len(matrix_left[0])) for x, y in path_middle]
        path_right_offset = [(x, y + len(matrix_left[0]) + len(matrix_middle[0])) for x, y in path_right]

        # Assign paths to the three objects (harvesters).
        object1_path = path_left
        object2_path = path_middle_offset
        object3_path = path_right_offset

        print("Object 1 Path:", object1_path)
        print("Object 2 Path:", object2_path)
        print("Object 3 Path:", object3_path)
    elif NUM_HARVESTERS == 4:
        top_left, top_right, bottom_left, bottom_right = split_matrix_four(matrix)
        
        min_distance_tl, best_order_tl, path_tl = compute_path(top_left)
        min_distance_tr, best_order_tr, path_tr = compute_path(top_right)
        min_distance_bl, best_order_bl, path_bl = compute_path(bottom_left)
        min_distance_br, best_order_br, path_br = compute_path(bottom_right)

        path_tr_offset = [(x, y + len(top_left[0])) for x, y in path_tr]
        path_bl_offset = [(x + len(top_left), y) for x, y in path_bl]
        path_br_offset = [(x + len(top_left), y + len(top_right[0])) for x, y in path_br]

        object1_path = path_tl
        object2_path = path_tr_offset
        object3_path = path_bl_offset
        object4_path = path_br_offset

        print("Object 1 Path:", object1_path)
        print("Object 2 Path:", object2_path)
        print("Object 3 Path:", object3_path)
        print("Object 4 Path:", object4_path)
    if NUM_HARVESTERS == 5:
        top_left, bottom_left, top_right, middle_right, bottom_right = split_matrix_five(matrix)
        
        min_distance_tl, best_order_tl, path_tl = compute_path(top_left)
        min_distance_bl, best_order_bl, path_bl = compute_path(bottom_left)
        min_distance_tr, best_order_tr, path_tr = compute_path(top_right)
        min_distance_mr, best_order_mr, path_mr = compute_path(middle_right)
        min_distance_br, best_order_br, path_br = compute_path(bottom_right)

        path_bl_offset = [(x + len(top_left), y) for x, y in path_bl]
        path_tr_offset = [(x, y + len(top_left[0])) for x, y in path_tr]
        path_mr_offset = [(x + len(top_right), y + len(bottom_left[0])) for x, y in path_mr]
        path_br_offset = [(x + 2 * len(top_right), y + len(bottom_left[0])) for x, y in path_br]

        object1_path = path_tl
        object2_path = path_bl_offset
        object3_path = path_tr_offset
        object4_path = path_mr_offset
        object5_path = path_br_offset

        print("Object 1 Path:", object1_path)
        print("Object 2 Path:", object2_path)
        print("Object 3 Path:", object3_path)
        print("Object 4 Path:", object4_path)
        print("Object 5 Path:", object5_path)

if __name__ == "__main__":
    main()