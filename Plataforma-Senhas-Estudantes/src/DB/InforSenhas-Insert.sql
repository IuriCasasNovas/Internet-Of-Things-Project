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
(2, 1, 'Informatica', 'A123'), (4, 1, 'Multimedia', 'A124'), (5, 1, 'Informatica', 'A125'),
(6, 1, 'Gestao', 'A126'), (7, 1, 'Enfermagem', 'A127'), (8, 1, 'Multimedia', 'A128'),
(9, 1, 'Informatica', 'A129'), (10, 1, 'Desporto', 'A130');

INSERT INTO Auxiliar (Pessoa, Turno, Data_Contratacao_Auxiliar) VALUES (3, 2, '2022-09-01');

INSERT INTO Cartao (Aluno, Estado_Cartao) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1);

INSERT INTO Compra (Aluno, Valor_Total_Compra, Metodo_Pagamento_Compra) VALUES
(1, 7.50, 'Multibanco'), (2, 5.00, 'MB WAY'), (3, 3.00, 'MB WAY'), (4, 6.50, 'Multibanco'),
(5, 4.20, 'Numerario'), (6, 7.50, 'MB WAY'), (7, 2.50, 'Multibanco'), (8, 5.00, 'MB WAY');

INSERT INTO Senha (Compra, Estado_Senha, Preco_Senha, Data_Validade_Senha, Data_Validacao_Senha, Auxiliar) VALUES
(1, 1, 2.50, '2025-11-10 12:00:00', NULL, 1),
(1, 1, 2.50, '2025-11-10 12:00:00', NULL, NULL),
(2, 2, 5.00, '2025-11-11 12:00:00', '2025-11-03 12:00:00', 1),
(3, 1, 3.00, '2025-11-12 12:00:00', NULL, NULL),
(4, 1, 3.25, '2025-11-12 12:00:00', NULL, 1),
(4, 1, 3.25, '2025-11-12 12:00:00', NULL, NULL),
(5, 1, 4.20, '2025-11-13 12:00:00', NULL, NULL),
(6, 1, 7.50, '2025-11-14 12:00:00', NULL, 1),
(7, 1, 2.50, '2025-11-14 12:00:00', NULL, NULL),
(8, 1, 5.00, '2025-11-15 12:00:00', NULL, 1);

INSERT INTO Validacao (Cartao, Aluno, Resultado_Validacao) VALUES
(1, 1, 'Valido'), (2, 2, 'Invalido'), (3, 3, 'Valido'), (4, 4, 'Valido'),
(5, 5, 'Invalido'), (6, 6, 'Valido'), (7, 7, 'Valido'), (8, 8, 'Invalido');

