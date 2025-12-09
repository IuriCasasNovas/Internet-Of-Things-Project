INSERT INTO Pessoa (Nome_Pessoa, Email_Pessoa, Palavra_Passe_Pessoa, Telefone_Pessoa, Data_Nascimento_Pessoa, Foto_Pessoa) VALUES
('Joao Silva', 'joao.silva@estudantes.ips.pt', 'Joao123', '912345678', '2000-05-14', 'joao.jpg'),
('Maria Costa', 'maria.costa@estudantes.ips.pt', 'Maria123', '913456789', '1998-08-22', 'maria.jpg'),
('Pedro Santos', 'pedro.santos@estudantes.ips.pt', 'Pedro123', '914567890', '1995-11-10', 'pedro.jpg'),
('Ana Rocha', 'ana.rocha@estudantes.ips.pt', 'Ana123', '915678901', '2001-03-25', 'ana.jpg'),
('Rita Almeida', 'rita.almeida@estudantes.ips.pt', 'Rita123', '916789012', '2002-01-12', 'rita.jpg'),
('Bruno Ferreira', 'bruno.ferreira@estudantes.ips.pt', 'Bruno123', '917890123', '1999-06-30', 'bruno.jpg'),
('Carla Mendes', 'carla.mendes@estudantes.ips.pt', 'Carla123', '918901234', '2000-09-18', 'carla.jpg'),
('Diogo Pereira', 'diogo.pereira@estudantes.ips.pt', 'Diogo123', '919012345', '1997-12-05', 'diogo.jpg'),
('Sofia Martins', 'sofia.martins@estudantes.ips.pt', 'Sofia123', '910123456', '2001-04-08', 'sofia.jpg'),
('Hugo Carvalho', 'hugo.carvalho@estudantes.ips.pt', 'Hugo123', '911234567', '1996-07-21', 'hugo.jpg');

INSERT INTO Estado_Cartao (Estado) VALUES ('Ativo'), ('Inativo'), ('Cancelado');
INSERT INTO Estado_Senha (Estado) VALUES ('Disponivel'), ('Utilizada'), ('Expirada');

INSERT INTO Turno (Turno) VALUES ('Manha'), ('Tarde'), ('Noite');

INSERT INTO Administrador (Pessoa, Data_Login_Administrador) VALUES (1, NOW());

INSERT INTO Aluno (Pessoa, Estado_Cartao, Curso_Aluno, Numero_Aluno) VALUES
(2, 1, 'Informatica', 'A123'), 
(4, 1, 'Multimedia', 'A124'), 
(5, 1, 'Informatica', 'A125'),
(6, 1, 'Gestao', 'A126'), 
(7, 1, 'Enfermagem', 'A127'), 
(8, 1, 'Multimedia', 'A128'),
(9, 1, 'Informatica', 'A129'), 
(10, 1, 'Desporto', 'A130');

INSERT INTO Auxiliar (Pessoa, Turno, Data_Contratacao_Auxiliar) VALUES (3, 2, '2022-09-01');

INSERT INTO Cartao (Aluno, Estado_Cartao) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1);

INSERT INTO Compra (Aluno, Valor_Total_Compra, Metodo_Pagamento_Compra, Data_Hora_Compra) VALUES
(1, 5.80, 'Multibanco', '2025-11-01 10:00:00'), 
(2, 5.80, 'MB WAY', '2025-11-02 11:30:00'), 
(3, 2.90, 'MB WAY', '2025-11-03 12:15:00'), 
(4, 5.80, 'Multibanco', '2025-11-04 09:45:00'),
(5, 2.90, 'Multibanco', '2025-11-05 14:20:00'), 
(6, 5.80, 'MB WAY', '2025-11-06 16:10:00'), 
(7, 8.70, 'Multibanco', '2025-11-07 08:50:00'), 
(8, 2.90, 'MB WAY', '2025-11-08 13:05:00');

INSERT INTO Senha (Compra, Estado_Senha, Preco_Senha, Data_Validade_Senha, Data_Validacao_Senha, Auxiliar, Aluno) VALUES
(1, 1, 2.90, '2025-12-31 23:59:59', NULL, 1, 1),  
(1, 1, 2.90, '2025-12-31 23:59:59', NULL, NULL, 1),
(2, 1, 2.90, '2025-12-31 23:59:59', NULL, NULL, 2), 
(3, 1, 2.90, '2025-12-31 23:59:59', NULL, NULL, 3),
(4, 1, 2.90, '2025-12-31 23:59:59', NULL, 1, 4), 
(4, 1, 2.90, '2025-12-31 23:59:59', NULL, NULL, 4),
(5, 1, 2.90, '2025-12-31 23:59:59', NULL, NULL, 5),
(6, 1, 2.90, '2025-12-31 23:59:59', NULL, 1, 6), 
(7, 1, 2.90, '2025-12-31 23:59:59', NULL, NULL, 7), 
(8, 1, 2.90, '2025-12-31 23:59:59', NULL, 1, 8); 

INSERT INTO Validacao (Cartao, Senha, Auxiliar, Resultado_Validacao, Data_Hora_Validacao) VALUES
(1, 1, 1, 'Valido', '2025-11-10 12:00:00'),
(2, 2, 1, 'Valido', '2025-11-10 12:05:00'),
(3, 3, 1, 'Valido', '2025-11-11 12:10:00'),
(4, 4, 1, 'Valido', '2025-11-12 12:15:00'),
(5, 5, 1, 'Valido', '2025-11-13 12:20:00'),
(6, 6, 1, 'Valido', '2025-11-14 12:25:00'),
(7, 7, 1, 'Valido', '2025-11-14 12:30:00'),
(8, 8, 1, 'Valido', '2025-11-15 12:35:00');
