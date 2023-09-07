# -*- coding: utf-8 -*-
"""
Created on Mon Sep  4 9:53:44 2023

@author: oscar
"""

import numpy as np
import heapq
import random
import json
import sys
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

def tsp(matrix, start_point):
    """
    Solve the Travelling Salesman Problem for points in the matrix marked by 1's.
    
    Parameters:
    - matrix: 2D list containing 0's and 1's.
    - start_point: Tuple of start point (row, column). If not provided, a random choice from the border will be made.
    
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

    # Si aucun point de départ n'est fourni, choisissez un point aléatoire de la frontière comme avant
    if not start_point:
        border_points = [points[i] for i in range(num_points) if 
                         points[i][0] == 0 or 
                         points[i][1] == 0 or 
                         points[i][0] == len(matrix) - 1 or 
                         points[i][1] == len(matrix[0]) - 1]
        start_point = random.choice(border_points)
    
    print("points: ", points)

    start_point = tuple(start_point)
    print("start_point",start_point)
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

def split_matrix(matrix, start_positions):

    left_matrix = []
    right_matrix = []
            
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if (i, j) in start_positions:
                # Include the starting point in the appropriate submatrix
                if j < len(matrix[0]) // 2:
                    left_matrix.append([matrix[i][j]])
                else:
                    right_matrix.append([matrix[i][j]])
            elif j < len(matrix[0]) // 2:
                left_matrix.append([matrix[i][j]])
            else:
                right_matrix.append([matrix[i][j]])

    return left_matrix, right_matrix


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
# ==========================
# Main Execution and output
# ==========================

# Modify the compute_path function
def compute_path(matrix, startingPoint):
    min_distance, best_order, path = tsp(matrix, startingPoint)
    return min_distance, best_order, path



try:
    startingPoint = sys.argv[1]
    startingPoint = json.loads(startingPoint)

    fieldMatrix = sys.argv[2]
    matrix = json.loads(fieldMatrix)

except json.JSONDecodeError:
    print('Invalid JSON syntax')


    min_distance, best_order, path = compute_path(matrix, startingPoint)
    print(f"Harvester starting from {start_positions[0]} Path:", path)



