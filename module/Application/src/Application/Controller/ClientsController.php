<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Application\Models\Client;

class ClientsController extends AbstractActionController
{
    public function indexAction()
    {
        return new ViewModel();
    }

    public function searchAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client($this->getRequest()->getParams());
            $data = $client->search(); 
            if ($data)
                return new JsonModel(['code' => 201, 'message' => 'OK', 'data' => $data]);
            else
                return new JsonModel(['code' => 400, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function saveAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client($this->getRequest()->getParams());
            if ($client->save())
                return new JsonModel(['code' => 201, 'message' => 'OK']);
            else
                return new JsonModel(['code' => 400, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function deleteAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client($this->getRequest()->getParams());
            if ($client->delete())
                return new JsonModel(['code' => 201, 'message' => 'OK']);
            else
                return new JsonModel(['code' => 400, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }
}